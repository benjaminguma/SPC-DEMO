import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
  MinLength,
  isEmail,
  isPhoneNumber,
} from 'class-validator';

import { IsOneOf } from '../decorators/is-one-of';

class BaseLoginDTO {
  @IsOneOf(
    {
      message: 'not a valid email or phone number',
    },
    [
      { validator: isEmail, message: 'invalid email' },
      { validator: isPhoneNumber, message: '' },
    ],
  )
  @IsNotEmpty()
  @IsString()
  field: string;
}
export class LoginVerDTO extends BaseLoginDTO {
  // @IsNotEmpty()
  @IsString()
  @IsOptional()
  password: string;
}

export class LoginDTO {
  @MinLength(10)
  @IsNotEmpty()
  @IsString()
  email: string;

  @Length(6, 6)
  @IsNotEmpty()
  @IsString()
  otp: string;

  @IsNotEmpty()
  @IsString()
  token: string;
}
export class OTPLoginRequestDTO {
  @IsEmail()
  @IsNotEmpty()
  @IsString()
  email: string;
}
