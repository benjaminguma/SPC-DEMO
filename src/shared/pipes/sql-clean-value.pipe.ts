import {
  PipeTransform,
  Injectable,
  UnprocessableEntityException,
} from '@nestjs/common';

@Injectable()
export class SqlInjFreeStringValidationPipe implements PipeTransform {
  constructor(isRequired = false) {
    this.isRequired = isRequired;
  }
  private isRequired: boolean;
  transform(value: any) {
    if (/(^true$)|(^yes$)|(^1$)/i.test(value)) {
      throw new UnprocessableEntityException('invalid value');
    }
    if (this.isRequired) {
      if (String(value).trim().length === 0) {
        throw new UnprocessableEntityException('invalid value');
      }
    }

    return value;
  }
}
