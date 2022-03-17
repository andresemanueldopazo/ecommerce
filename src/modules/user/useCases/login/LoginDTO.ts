import { JWTToken, RefreshToken } from '../../domain/jwt';

export interface LoginDTORequest {
  userName: string;
  password: string;
}

export interface LoginDTOResponse {
  accessToken: JWTToken;
  refreshToken: RefreshToken;
}
