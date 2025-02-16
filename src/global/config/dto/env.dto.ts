import { IsNotEmpty, IsString } from 'class-validator';

export class EnvVarDTO {
  @IsNotEmpty()
  @IsString()
  DATABASE_NAME: string;
  @IsNotEmpty()
  @IsString()
  DATABASE_PORT: string;
  @IsNotEmpty()
  @IsString()
  DATABASE_HOST: string;
  @IsNotEmpty()
  @IsString()
  DATABASE_USERNAME: string;
  @IsNotEmpty()
  @IsString()
  DATABASE_PASSWORD: string;
}
