import 'reflect-metadata';
import request from 'supertest';
import { BaseUser } from './infra/database/BaseUser';
import { client } from './services/auth/implementation/redis/clientRedis';
import { dataSource } from '../../shared/infra/database/dataSourceTypeorm';
import { app } from '../../shared/infra/http/app';
import { LoginDTOResponse } from './useCases/login/LoginDTO';
import { UserDTO } from './dtos/UserDTO';
import { RefreshAccessTokenDTO } from './useCases/refreshAccessToken/RefreshAccessTokenDTO';

describe('/api/v1/users endpoint', () => {
  beforeAll(async () => {
    await dataSource.initialize();
    await client.connect();
    await dataSource.getRepository(BaseUser).clear();
    await client.flushAll();
  });
  
  afterEach(async () => {
    await dataSource.getRepository(BaseUser).clear();
    await client.flushAll();
  });

  const seller = {
    userName: 'cristianronaldinho',
    email: 'cristianronaldinho@gmail.com',
    password: 'cristianronaldinho',
  }

  const customer = {
    userName: 'leonardomessirve',
    email: 'leonardomessirve@gmail.com',
    password: 'leonardomessirve',
  }

  it('should be able to create a new user', async () => {
    const response = await request(app)
      .post('/api/v1/users')
      .send(customer);
    expect(response.statusCode).toEqual(200);

    const user = await dataSource
      .getRepository(BaseUser)
      .findOneBy({ user_name: customer.userName });

    expect(user!.user_name).toEqual(customer.userName);
  });

  it('should be able to login a user', async () => {
    const createResponse = await request(app)
      .post('/api/v1/users')
      .send(customer);
    expect(createResponse.statusCode).toEqual(200);

    const loginResponse = await request(app)
      .post('/api/v1/users/login')
      .send({
        userName: customer.userName,
        password: customer.password,
      });
    expect(loginResponse.statusCode).toEqual(200);

    const keys = await client.keys(`*${customer.userName}`);
    expect(keys).toHaveLength(1);

    const dtoLoginResponse = loginResponse.body as LoginDTOResponse;
    expect(keys[0].includes(dtoLoginResponse.refreshToken)).toBeTruthy();

    const tokenRedis = await client.get(keys[0]);
    expect(dtoLoginResponse.accessToken).toEqual(tokenRedis);
  });

  it('should be able to return the logged user', async () => {
    const createResponse = await request(app)
      .post('/api/v1/users')
      .send(customer);
    expect(createResponse.statusCode).toEqual(200);

    const loginResponse = await request(app)
      .post('/api/v1/users/login')
      .send({
        userName: customer.userName,
        password: customer.password,
      });
    expect(loginResponse.statusCode).toEqual(200);
    const dtoLoginResponse = loginResponse.body as LoginDTOResponse;

    const getMeResponse = await request(app)
      .get('/api/v1/users/me')
      .set('Authorization', dtoLoginResponse.accessToken);

    const user = getMeResponse.body as UserDTO;
    expect(user.userName).toEqual(customer.userName);
  });

  it('should be able to refresh the the token', async () => {
    const createResponse = await request(app)
      .post('/api/v1/users')
      .send(customer);
    expect(createResponse.statusCode).toEqual(200);

    const loginResponse = await request(app)
      .post('/api/v1/users/login')
      .send({
        userName: customer.userName,
        password: customer.password,
      });
    expect(loginResponse.statusCode).toEqual(200);
    const dtoLoginResponse = loginResponse.body as LoginDTOResponse;

    const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

    await wait(1000);

    const remainingTimeBeforeRefresh = await client.ttl(
      `refresh-${dtoLoginResponse.refreshToken}.activeJwtClients.${customer.userName}`
    );

    const responseRefresh = await request(app)
      .post('/api/v1/users/token/refresh')
      .send({ refreshToken: dtoLoginResponse.refreshToken });
    expect(responseRefresh.statusCode).toEqual(200);
    const refreshDTOResponse = loginResponse.body as RefreshAccessTokenDTO;

    const remainingTimeAfterRefresh = await client.ttl(
      `refresh-${refreshDTOResponse.refreshToken}.activeJwtClients.${customer.userName}`
    );

    expect(remainingTimeAfterRefresh).toBeGreaterThan(
      remainingTimeBeforeRefresh
    );
  });

  it('should be able to logout a user', async () => {
    const createResponse = await request(app)
      .post('/api/v1/users')
      .send(customer);
    expect(createResponse.statusCode).toEqual(200);

    const loginResponse = await request(app)
      .post('/api/v1/users/login')
      .send({
        userName: customer.userName,
        password: customer.password,
      });
    expect(loginResponse.statusCode).toEqual(200);
    const dtoLoginResponse = loginResponse.body as LoginDTOResponse;

    const responseLogout = await request(app)
      .post('/api/v1/users/logout')
      .set('Authorization', dtoLoginResponse.accessToken);

    expect(responseLogout.statusCode).toEqual(200);

    const keys = await client.keys(`*${customer.userName}`);
    expect(keys).toHaveLength(0);
  });

  test('a seller user should be able to get a user', async () => {
    const customerCreateResponse = await request(app)
      .post('/api/v1/users')
      .send(customer);
    expect(customerCreateResponse.statusCode).toEqual(200);

    const sellerCreateResponse = await request(app)
      .post('/api/v1/users')
      .send(seller);
    expect(sellerCreateResponse.statusCode).toEqual(200);

    await dataSource.getRepository(BaseUser).update(
      { user_name: seller.userName },
      { is_seller: true }
    );

    const sellerLoginResponse = await request(app)
      .post('/api/v1/users/login')
      .send({ userName: seller.userName, password: seller.password });

    const sellerLoginDTOResponse = sellerLoginResponse.body;

    const getUserResponse = await request(app)
      .get('/api/v1/users')
      .send({ userName: customer.userName })
      .set('Authorization', sellerLoginDTOResponse.accessToken);
    expect(getUserResponse.statusCode).toEqual(200);

    expect(getUserResponse.body.userName).toEqual(
      customer.userName
    );
  });

  test('a seller user should be able to delete a user', async () => {
    const sellerCreateResponse = await request(app)
    .post('/api/v1/users')
    .send(seller);
    expect(sellerCreateResponse.statusCode).toEqual(200);

    await dataSource.getRepository(BaseUser).update(
      { user_name: seller.userName },
      { is_seller: true }
      );
      
      const sellerLoginResponse = await request(app)
      .post('/api/v1/users/login')
      .send({ userName: seller.userName, password: seller.password });

    const sellerLoginDTOResponse = sellerLoginResponse.body;

    const customerCreateResponse = await request(app)
      .post('/api/v1/users')
      .send(customer);
    expect(customerCreateResponse.statusCode).toEqual(200);

    const deleteResponse = await request(app)
    .delete('/api/v1/users')
    .send({ userName: customer.userName })
    .set('Authorization', sellerLoginDTOResponse.accessToken);
    expect(deleteResponse.statusCode).toEqual(200);

    const customerDB = await dataSource.getRepository(BaseUser).findOneBy(
      { user_name: customer.userName }
    );

    expect(customerDB!.is_deleted).toBeTruthy();
  });
});
