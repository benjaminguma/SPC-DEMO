import { User } from '../model/user.entity';

export const AUTHENTICATION_EVENTS = {
  SIGNUP: 'SIGNUP',
  LOGIN: 'LOGIN',
  FORGOT_PASSWORD: 'FORGOT_P',
};

export class AuthEvent {
  constructor(public user: User) {}
}
