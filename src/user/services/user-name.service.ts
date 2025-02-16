import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/auth/model/user.entity';
import { Repository } from 'typeorm';
import { IUserNameService } from './types/user.interface';
import { handleCatch } from 'src/utils';

@Injectable()
export class UserNameService implements IUserNameService {
  constructor(
    @InjectRepository(User)
    private readonly users: Repository<User>,
  ) {}

  async checkIfUserNameExists(userName: string): Promise<boolean> {
    return false;
  }
}
