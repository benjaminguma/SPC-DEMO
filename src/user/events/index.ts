import { User } from 'src/auth/model/user.entity';

export class UserCreatedEvent {
  constructor(public user: User) {}
}
