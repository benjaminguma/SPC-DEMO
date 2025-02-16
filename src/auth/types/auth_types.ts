import { User } from '../model/user.entity';

export enum TopLevelRoles {
  SUPER_ADMIN = 'SUDO',
  ADMIN = 'ADMIN',
  USER = 'USER',
}

export type connectionTypes = 'database' | 'passwordless' | 'sso-google';
export type TAuthCredentialType = 'email' | 'phonenumber';

export type TokenPayload = {
  nonce: string;
  iss?: string;
  username: string;
  email: string;
  exp?: number;
  iat?: number;
  jti?: string;
  user_id: string;
};
