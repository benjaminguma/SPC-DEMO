import { IsOptional, IsString, MinLength } from 'class-validator';

import { XOREmailOrPhone } from './email-xor-phone.dto';

export class SignupDTO extends XOREmailOrPhone {
  @IsOptional()
  @MinLength(6)
  @IsString()
  password: string;
}
