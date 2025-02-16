import {
  BadRequestException,
  Body,
  Controller,
  NotFoundException,
  Post,
  Req,
  UnprocessableEntityException,
  UseGuards,
} from '@nestjs/common';
import { UpdatePasswordDTO } from '../dto/passwords/update-password.dto';
import { successObj } from 'src/utils';
import { AuthGuard } from '@nestjs/passport';
import { UserService } from '../services/user.service';
import { AuthService } from '../services/auth.service';
import {
  ForgotPasswordDTO,
  ForgotPasswordUVerifyDTOForOTP,
  ForgotPasswordUpdateDTOForOTP,
  passwordRecoveryStrategies,
} from '../dto/passwords/forgot-password.dto';
import { OtpService } from '../services/otp.service';
import { BlockedUserService } from '../services/blocked-user.service';
import { OTP_CODE_TYPES } from '../types/otp_types';

@Controller('auth/passwords')
export class PasswordsController {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
    private readonly otpService: OtpService,
    private readonly blockedService: BlockedUserService,
  ) {}

  @UseGuards(AuthGuard('jwt'))
  @Post('update')
  async updatePassword(
    @Body() data: UpdatePasswordDTO,
    @Req() req: RequestWithUserPayload,
  ) {
    const userWithPassword = await this.userService.getUserById(
      req.user.user_id,
    );
    const isPasswordValid = await this.authService.isValidPassword(
      data.oldPassword,
      userWithPassword.password,
    );
    if (!isPasswordValid) {
      throw new BadRequestException('invalid credentials');
    }
    const hashedPassword = await this.authService.hashPassword(
      data.newPassword,
    );

    await this.userService.updateUserDetails(req.user, {
      password: hashedPassword,
    });

    return {
      ...successObj,
      message: 'password updated',
    };
  }

  @Post('forgot-password/verify')
  async handleForgotPasswordVerification(@Body() data: ForgotPasswordDTO) {
    const { user, credentialType } =
      await this.authService.getCredentialTypeAndUser(data.field);

    if (!user) {
      throw new NotFoundException(
        'error occured while trying to retrieve user data',
      );
    }

    if (await this.blockedService.userIsBlocked(user)) {
      throw new BadRequestException('user is blocked please try again later');
    }

    if (data.strategy === passwordRecoveryStrategies.otp) {
      const token = await this.otpService.processOTP(
        data.field,
        OTP_CODE_TYPES.PASSWORD_RECOVERY_1,
        credentialType,
      );

      return {
        ...successObj,
        message: 'password recovery otp sent successfully',
        token,
      };
    }

    throw new UnprocessableEntityException('option not supported');
  }

  @Post('forgot-password/1/verify')
  async verifyPasswordUpdateOTP(@Body() data: ForgotPasswordUVerifyDTOForOTP) {
    const credentialType = this.authService.detectCredentialType(data.field);
    const isValid = await this.otpService.verifyOTP(
      {
        otp: data.otp,
        token: data.token,
        type: OTP_CODE_TYPES.PASSWORD_RECOVERY_1,
        field: data.field,
      },
      credentialType,
    );

    return {
      ...successObj,
      data: {
        is_valid: isValid,
      },
      message: 'otp is valid, you can proceed!',
    };
  }

  @Post('forgot-password/1/update')
  async handleForgotPasswordUpdateWithOTP(
    @Body() data: ForgotPasswordUpdateDTOForOTP,
  ) {
    const { user, credentialType } =
      await this.authService.getCredentialTypeAndUser(data.field);
    //
    if (!user) {
      throw new NotFoundException();
    }

    if (await this.blockedService.userIsBlocked(user)) {
      throw new BadRequestException('user is blocked please try again later');
    }

    await this.otpService.verifyOTP(
      {
        otp: data.otp,
        token: data.token,
        type: OTP_CODE_TYPES.PASSWORD_RECOVERY_1,
        field: data.field,
      },
      credentialType,
    );

    const hashedPassword = await this.authService.hashPassword(
      data.newPassword,
    );

    await this.userService.updateUserDetails(user, {
      password: hashedPassword,
    });

    return {
      ...successObj,
      message: 'password updated successfully!',
    };
  }
}
