import { User } from './model/user.entity';
import { Otp } from './model/otp.entity';
import { Global, Module, OnModuleInit } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthController } from './controllers/auth.controller';

// import { Role } from './model/commonroles.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

import { BlockedUser } from './model/blocked-user.entity';
import { BlockedUserService } from './services/blocked-user.service';
import { PasswordsController } from './controllers/passwords.controller';

import { AuthService } from './services/auth.service';
import { OtpService } from './services/otp.service';
import { UserService } from './services/user.service';
import { JwtStrategy } from './strategies/jwt.strategy';
import { AuthVerificationController } from './controllers/auth-verification.controller';
import { AuthCredentialService } from './services/auth-credential.service';
import { AuthCredential } from './model/auth.credential.entity';

@Global()
@Module({
  imports: [
    PassportModule.register({
      defaultStrategy: 'jwt',
    }),
    //
    JwtModule.register({
      secret: process.env.SECRET,

      signOptions: {
        algorithm: 'HS256',
        expiresIn: '3000h',
      },
    }),
    TypeOrmModule.forFeature([Otp, User, BlockedUser, AuthCredential]),
  ],
  providers: [
    OtpService,
    UserService,
    JwtStrategy,
    BlockedUserService,
    AuthService,
    AuthCredentialService,
  ],
  controllers: [
    AuthController,
    PasswordsController,
    AuthVerificationController,
  ],
  exports: [UserService, AuthService],
})
export class AuthModule implements OnModuleInit {
  constructor(
    private readonly usersService: UserService,
    private readonly authService: AuthService,
  ) {}

  async onModuleInit() {
    try {
      // await this.usersService.createUser({
      //   firstname: 'frisk',
      //   lastname: 'mojo',
      //   email: 'friskmojo@yopmail.com',
      //   email_verified: true,
      //   password: '1234',
      // });

      const user = await this.usersService.getUser({
        where: {
          email: 'friskmojo@yopmail.com',
        },
      });

      console.log(this.authService.SignUserToken(user));
      console.log('demo user created ');
    } catch (error) {
      console.error('Failed to initialize control panel settings:', error);
    }
  }
}

// BasicRoleController
