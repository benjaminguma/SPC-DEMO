import {
  BadRequestException,
  Injectable,
  UnprocessableEntityException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { InjectRepository } from '@nestjs/typeorm';
import {
  DataSource,
  EntityManager,
  Equal,
  FindOneOptions,
  Repository,
  TypeORMError,
} from 'typeorm';
import { User } from '../model/user.entity';

import { SignupDTO } from '../dto/signup.dto';
import { handleCatch } from 'src/utils';
import { credentialType } from '../types/otp_types';
import { UtilsService } from 'src/utils/services/utils.service';
import { OnEvent } from '@nestjs/event-emitter';
import { AUTHENTICATION_EVENTS, AuthEvent } from '../events/auth.event';
import { BaseTransaction } from 'src/shared/services/base-transaction.service';

type SE = SignupDTO & {
  type: 'email';
};
type SP = SignupDTO & {
  type: 'phonenumber';
};

@Injectable()
export class UserService extends BaseTransaction {
  constructor(
    @InjectRepository(User) private readonly users: Repository<User>,
    private readonly authService: AuthService,
    public datasource: DataSource,
    private readonly utils: UtilsService,
  ) {
    super(datasource);
  }
  async getUserById(id: string): Promise<User> {
    try {
      return await this.users
        .createQueryBuilder('user')
        .addSelect('user.password')
        .addSelect('user.id')
        .where('user.id = :uid', { uid: id })
        .getOne();
    } catch (error) {
      return handleCatch(error);
    }
  }
  async getUser(q: FindOneOptions<User>): Promise<User> {
    try {
      const user = await this.users.findOne(q);

      return user;
    } catch (error) {
      console.log(error);
      throw new BadRequestException('failed to get user');
    }
  }

  private generateUserId() {
    return this.utils.generateULIDForEntity(
      this.utils.entitityCodePrefixes.USER,
    );
  }

  async createUser(details: Partial<User>): Promise<User> {
    details.user_id =
      details.user_id ||
      this.utils.generateULIDForEntity(this.utils.entitityCodePrefixes.USER);
    return await this.users.save(this.users.create(details));
  }

  async updateUserDetails(
    updateInitiatorDetails: User,
    newDetails: Partial<User> = {} as User,
    manager: EntityManager = this.users.manager,
  ): Promise<User> {
    try {
      const updated = manager.merge(User, updateInitiatorDetails, {
        ...newDetails,
      } as User);

      return await manager.save(User, updated);
    } catch (error) {
      console.log(error);
      if (error instanceof TypeORMError) {
        console.log(error);
        throw new BadRequestException(
          'error occured while updating details please try again',
        );
      } else throw error;
    }
  }
}
