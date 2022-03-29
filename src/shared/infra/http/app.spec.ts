import 'reflect-metadata';
import request from 'supertest';
import { BaseUser } from '../../../modules/user/infra/database/BaseUser';
import { client } from '../../../modules/user/services/auth/implementation/redis/clientRedis';
import { dataSource } from '../database/dataSourceTypeorm';
import { app } from './app';
import { LoginDTOResponse } from '../../../modules/user/useCases/login/LoginDTO';
import { UserDTO } from '../../../modules/user/dtos/UserDTO';

describe('app /api/v1', () => {
  describe('/users', () => {
    beforeAll(async () => {
      await dataSource.initialize();
      await client.connect();
    });

    afterAll(async () => {
      await dataSource.getRepository(BaseUser).clear();
      await client.flushAll();
    });

    const userName = 'cristianronaldinho';

    it('', async () => {
      const response = await request(app)
        .post('/api/v1/users')
        .send({
          userName: userName,
          email: 'cristianronaldinho@gmail.com',
          password: 'cristianronaldinho',
        });
        
      expect(response.statusCode).toEqual(200);

      const user = await dataSource
        .getRepository(BaseUser)
        .findOneBy({ user_name: userName });

      expect(user!.user_name).toEqual(userName);
    });

    let dtoResponse: LoginDTOResponse;

    it('', async () => {
      const response = await request(app)
        .post('/api/v1/users/login')
        .send({
          userName: userName,
          password: 'cristianronaldinho',
        });

      const keysRedis = await client.keys(`*${userName}`);
      expect(keysRedis).toHaveLength(1);

      dtoResponse = response.body as LoginDTOResponse;
      expect(keysRedis[0].includes(dtoResponse.refreshToken)).toBeTruthy();

      const tokenRedis = await client.get(keysRedis[0]);
      expect(dtoResponse.accessToken).toEqual(tokenRedis);
    });
    
    it('', async () => {
      const response = await request(app)
        .get('/api/v1/users/me')
        .set('Authorization', dtoResponse.accessToken);

      const user = response.body.user as UserDTO;
      expect(user.userName).toEqual(userName);
    });

    it('', async () => {
      const response = await request(app)
        .post('/api/v1/users/logout')
        .set('Authorization', dtoResponse.accessToken);

      expect(response.statusCode).toEqual(200);

      const keysRedis = await client.keys(`*${userName}`);
      expect(keysRedis).toHaveLength(0);
    });
  });
});
