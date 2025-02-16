import {
  Body,
  Controller,
  Post,
  Inject,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { OtpService } from '../services/otp.service';

import { UserService } from '../services/user.service';
import { successObj } from 'src/utils';
import { LoginDTO, OTPLoginRequestDTO } from '../dto/signin.dto';
import { OTP_CODE_TYPES } from '../types/otp_types';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly otpService: OtpService,
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}

  //
  @Post('otp/sign-in')
  async signinOtpRequest(@Body() data: OTPLoginRequestDTO) {
    const user = await this.userService.getUser({
      where: {
        email: data.email,
      },
    });
    if (!user) {
      throw new NotFoundException('user does not exist');
    }

    const token = await this.otpService.processOTP(
      data.email,
      OTP_CODE_TYPES.LOGIN,
      'email',
    );

    return {
      ...successObj,
      data: {
        token,
      },
    };
  }
  //
  @Post('sign-in')
  async signin(@Body() data: LoginDTO) {
    const user = await this.userService.getUser({
      where: {
        email: data.email,
      },
    });
    if (!user) {
      throw new NotFoundException('user does not exist');
    }

    //
    this.otpService.verifyOTP(
      {
        otp: data.otp,
        token: data.token,
        field: data.email,
        type: OTP_CODE_TYPES.LOGIN,
      },
      'email',
    );

    const jwt = this.authService.SignUserToken(user);

    return {
      ...successObj,
      data: {
        token: jwt,
      },
    };
  }
}
