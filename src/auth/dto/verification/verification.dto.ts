import {
  IsEmail,
  IsNotEmpty,
  IsPhoneNumber,
  IsString,
  IsUUID,
  Length,
} from 'class-validator';

export class EmailVerificationRequestDTO {
  @IsEmail()
  email: string;
}
export class PhoneVerificationRequestDTO {
  @IsPhoneNumber('NG')
  phone_number: string;
}

export class EmailVerificationDTO extends EmailVerificationRequestDTO {
  @Length(6, 6)
  @IsNotEmpty()
  @IsString()
  otp: string;

  @IsUUID()
  @IsNotEmpty()
  @IsString()
  token: string;
}

export class PhoneVerificationDTO extends PhoneVerificationRequestDTO {
  @Length(6, 6)
  @IsNotEmpty()
  @IsString()
  otp: string;

  @IsUUID()
  @IsNotEmpty()
  @IsString()
  token: string;
}
