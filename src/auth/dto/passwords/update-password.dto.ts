import {
  IsNotEmpty,
  IsString,
  IsStrongPassword,
  isEmail,
  isPhoneNumber,
} from 'class-validator';

export class UpdatePasswordDTO {
  @IsStrongPassword({
    minLength: 4,
    minLowercase: -1,
    minUppercase: -1,
    minNumbers: 6,
    minSymbols: 0,
  })
  @IsNotEmpty()
  @IsString()
  oldPassword: string;

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
