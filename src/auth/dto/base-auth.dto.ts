import {
  IsEmail,
  IsNotEmpty,
  IsPhoneNumber,
  IsString,
  MaxLength,
  isEmail,
  isPhoneNumber,
} from 'class-validator';
import { connectionTypes } from '../types/auth_types';
import { IsOneOf } from '../decorators/is-one-of';

export class BaseAuthDTO1 {
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
}

export class OtpBaseDTO {
  @IsNotEmpty()
  @MaxLength(6)
  @IsString()
  otp: string;

  @IsNotEmpty()
  @IsString()
  token: string;
}
