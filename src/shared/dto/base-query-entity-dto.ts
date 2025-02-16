import {
  IsBoolean,
  IsNotIn,
  IsNumberString,
  IsOptional,
  IsString,
} from 'class-validator';
import { IsISODate } from '../decorators/Iso-date-string';

export class BaseQueryEntityDTO {
  @IsOptional()
  @IsNotIn(['true', '1'])
  @IsString()
  cursor?: string;

  @IsOptional()
  @IsISODate()
  @IsString()
  from?: string;

  @IsOptional()
  @IsISODate()
  @IsString()
  to?: string;

  @IsOptional()
  @IsBoolean()
  lean?: boolean;

  @IsOptional()
  @IsNumberString()
  page_size?: number;
}
