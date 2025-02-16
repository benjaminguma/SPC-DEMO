import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';
import { ObjectSchema } from 'joi';

@Injectable()
export class JoiValidationPipe implements PipeTransform {
  constructor(private schema: ObjectSchema) {}

  transform(value: any) {
    const { error, ...rest } = this.schema.validate(value);
    if (error) {
      throw new BadRequestException(error.details.map((e) => e.message));
    }
    // ! you have to retuurn reest.value
    return rest.value;
  }
}
//
