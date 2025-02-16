import { IsString, ValidateIf, isEmail, isPhoneNumber } from 'class-validator';
import MutuallyExclusive from '../decorators/mutually-exclusive';

export class XOREmailOrPhone {
  @MutuallyExclusive('phoneNumber', undefined, [
    { validator: isEmail, message: 'invalid email' },
  ])
  @IsString()
  email: string;

  @MutuallyExclusive('email', undefined, [
    {
      validator: (v) => isPhoneNumber(v, 'NG'),
      message: 'phonenumber is invalid',
    },
  ])
  @ValidateIf((v) => !v.email.trim())
  @IsString()
  phoneNumber: string;
}
