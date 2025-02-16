import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { OTP_CODE_TYPES } from 'src/auth/types/otp_types';

export class OtpVerificationnDTO {
  @IsNotEmpty()
  @IsString()
  field: string;

  @IsString()
  @IsNotEmpty()
  otp: string;

  @IsString()
  @IsNotEmpty()
  token: string;

  @IsNumber()
  type: OTP_CODE_TYPES;
}
