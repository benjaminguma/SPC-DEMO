import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { JwtService, JwtSignOptions } from '@nestjs/jwt';
import { TokenPayload } from '../types/auth_types';
import { User } from '../model/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, TypeORMError } from 'typeorm';
import { hash, genSalt, compare } from 'bcrypt';
import { isEmail, isPhoneNumber } from 'class-validator';
import { credentialType } from '../types/otp_types';
import { UtilsService } from 'src/utils/services/utils.service';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private users: Repository<User>,
    public readonly jwtService: JwtService,
    public readonly utils: UtilsService,
  ) {}
  detectCredentialType(cred: string): credentialType | never {
    if (isEmail(cred)) {
      return 'email';
    } else if (isPhoneNumber(cred, 'NG')) {
      return 'phonenumber';
    }
    throw new BadRequestException('invalid credentials');
  }
  //

  prepareUser = (user: User) => {
    return this.users.create(user);
  };

  async getCredentialTypeAndUser(cred: string) {
    let credentialType: credentialType = this.detectCredentialType(cred);

    let user: User;
    if (credentialType === 'email') {
      user = await this.findByEmail(cred);
      credentialType = 'email';
    } else if (credentialType === 'phonenumber') {
      user = await this.findByPhone(cred, true);
      credentialType = 'phonenumber';
    }
    return {
      user,
      credentialType,
    };
  }
  async findByEmail(email: string) {
    try {
      const user = this.userQueryWithPassword().where('user.email = :email', {
        email,
      });

      return await user.getOne();
    } catch (error) {
      console.log(error);
      if (error instanceof TypeORMError) {
        throw new BadRequestException(error.message);
      }
    }
  }
  async findByPhone(phoneNumber: string, verified = true) {
    try {
      const user = this.userQueryWithPassword().where('user.phone = :phone', {
        phone: phoneNumber,
      });

      if (verified) {
        user.andWhere('user.phone_verified = :v', { v: true });
      }

      return await user.getOne();
    } catch (error) {
      console.log(error);
      if (error instanceof TypeORMError) {
        throw new BadRequestException(error.message);
      }
    }
  }

  private userQueryWithPassword() {
    return this.users.createQueryBuilder('user').addSelect('user.password');
  }

  SignUserToken(data: User): string {
    delete data.password;
    const payload: TokenPayload = {
      user_id: data.user_id,
      email: data.email || '',
      username: data.user_id,
      nonce: this.utils.randomId(24),
    };
    try {
      const token = this.jwtService.sign(payload);
      return token;
    } catch (error) {
      console.log(error);
    }
  }
  signToken(data: any, options: JwtSignOptions): string {
    const payload: TokenPayload = data;
    try {
      const token = this.jwtService.sign(payload, options);
      return token;
    } catch (error) {
      console.log(error);
    }
  }

  async isValidPassword(passwordPlainText: string, hashedPassword: string) {
    try {
      const isValid = await compare(passwordPlainText, hashedPassword);
      return isValid;
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException('failed comparison');
    }
  }

  async hashPassword(password: string): Promise<string> {
    try {
      const salt = await genSalt(10);
      return await hash(password, salt);
    } catch (error) {
      console.log(error);
      throw new BadRequestException('error occured');
    }
  }

  async removeUser(user: User): Promise<boolean> {
    try {
      await this.users.remove(user);
      return true;
    } catch (error) {
      return false;
    }
  }
}
