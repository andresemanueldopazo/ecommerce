import { JWTClaims, JWTToken, RefreshToken } from '../../domain/jwt';
import { User } from '../../domain/User';

export interface IAuthService {
  signJWT(props: JWTClaims): JWTToken;
  decodeJWT(token: JWTToken): Promise<JWTClaims>;
  createRefreshToken(): RefreshToken;
  getTokens(userName: string): Promise<JWTToken[]>;
  saveAuthenticatedUser(user: User): Promise<void>;
  deAuthenticateUser(userName: string): Promise<void>;
  getUserNameFromRefreshToken(refreshToken: RefreshToken): Promise<string>;
}
