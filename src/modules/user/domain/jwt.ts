export interface JWTClaims {
  userId: string;
  isEmailVerified: boolean;
  email: string;
  userName: string;
  isSeller: boolean;
}

export type JWTToken = string;

export type SessionId = string;

export type RefreshToken = string;
