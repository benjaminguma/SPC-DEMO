import {
  IsEmail,
  IsIn,
  IsNotEmpty,
  IsNumber,
  IsString,
  IsStrongPassword,
  isEmail,
  isPhoneNumber,
} from 'class-validator';
import { IsOneOf } from 'src/auth/decorators/is-one-of';
import { BaseAuthDTO1, OtpBaseDTO } from '../base-auth.dto';

export enum passwordRecoveryStrategies {
  otp = 1,
  webAuthn = 2,
}

export class ForgotPasswordDTO extends BaseAuthDTO1 {
  @IsIn([passwordRecoveryStrategies.otp, passwordRecoveryStrategies.webAuthn])
  @IsNotEmpty()
  @IsNumber()
  strategy: passwordRecoveryStrategies;
}

export class ForgotPasswordUVerifyDTOForOTP extends OtpBaseDTO {
  // using only emails thats why
  @IsEmail()
  @IsString()
  field: string;
}

export class ForgotPasswordUpdateDTOForOTP extends OtpBaseDTO {
  @IsOneOf(
    {
      message: 'not a valid email or phone number',
    },
    [
      { validator: isEmail, message: 'invalid email ' },
      { validator: isPhoneNumber, message: '' },
    ],
  )
  @IsNotEmpty()
  @IsString()
  field: string;

  @IsStrongPassword({
    minLength: 4,
    minLowercase: -1,
    minUppercase: -1,
    minNumbers: 6,
    minSymbols: 0,
  })
  @IsNotEmpty()
  @IsString()
  newPassword: string;
}
