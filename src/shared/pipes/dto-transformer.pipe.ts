import { PipeTransform, Injectable, ArgumentMetadata } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { validateSync } from 'class-validator';

type Constructable<T> = new (...args: any[]) => T;

@Injectable()
export class DTOTransformer<T> implements PipeTransform {
  constructor(private instance: Constructable<T>) {}
  transform(value: Record<string, any>) {
    const currentInstance = plainToInstance(this.instance, value);

    const val = validateSync(currentInstance as object);

    return val[0].target;
  }
}
