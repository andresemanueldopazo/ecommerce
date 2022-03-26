import 'dotenv/config';
import * as jwt from 'jsonwebtoken';
import randtoken from 'rand-token';
import { RefreshToken, JWTClaims, JWTToken } from '../../../domain/jwt';
import { User } from '../../../domain/User';
import { IAuthService } from '../IAuthService';
import { IKeyValueStore } from './IKeyValueStore';

export class KeyValueStoreAuthService implements IAuthService {
  private readonly tokenExpiryTime: number = 9999999999;
  private readonly jwtHashName: string = 'activeJwtClients';
  private readonly secret: string = process.env.APP_SECRET!;

  constructor(private readonly keyValueStore: IKeyValueStore) {}

  public async getUserNameFromRefreshToken(
    refreshToken: RefreshToken,
  ): Promise<string | undefined> {
    const keys = await this.keyValueStore.getAllKeys(`*${refreshToken}*`);

    const exists = keys.length !== 0;
    if (!exists) {
      return;
    }

    const key = keys[0];

    return key.substring(
      key.indexOf(this.jwtHashName) + this.jwtHashName.length + 1,
    );
  }

  public async saveAuthenticatedUser(user: User): Promise<void> {
    if (user.isLoggedIn()) {
      await this.addToken(
        user.userName.value,
        user.accessToken!,
        user.refreshToken!,
      );
    } 
  }

  public async deAuthenticateUser(userName: string): Promise<void> {
    await this.clearAllSessions(userName);
  }

  public createRefreshToken(): RefreshToken {
    return randtoken.uid(256) as RefreshToken;
  }

  public signJWT(props: JWTClaims): JWTToken {
    const claims: JWTClaims = {
      email: props.email,
      userName: props.userName,
      userId: props.userId,
      adminUser: props.adminUser,
      isEmailVerified: props.isEmailVerified,
    };

    return jwt.sign(claims, this.secret, {
      expiresIn: this.tokenExpiryTime,
    });
  }

  public decodeJWT(token: string): Promise<JWTClaims | null> {
    return new Promise(resolve => {
      jwt.verify(token, this.secret, (err, decoded) => {
        if (err) return resolve(null);
        return resolve(decoded as JWTClaims);
      });
    });
  }

  private constructKey(userName: string, refreshToken: RefreshToken): string {
    return `refresh-${refreshToken}.${this.jwtHashName}.${userName}`;
  }

  public addToken(
    userName: string,
    refreshToken: RefreshToken,
    token: JWTToken,
  ): Promise<any> {
    return this.keyValueStore.set(
      this.constructKey(userName, refreshToken),
      token,
      this.tokenExpiryTime,
    );
  }

  public async getTokens(userName: string): Promise<JWTToken[]> {
    const keyValues = await this.keyValueStore.getAllKeyValue(
      `*${this.jwtHashName}.${userName}`,
    );
    return keyValues.map(kv => kv.value);
  }

  public async clearAllSessions(userName: string): Promise<any> {
    this.keyValueStore
      .getAllKeyValue(`*${this.jwtHashName}.${userName}`)
      .then(keyValues => {
        const keys = keyValues.map(kv => kv.key);
        return Promise.all(keys.map(key => this.keyValueStore.deleteOne(key)));
      });
  }
}
