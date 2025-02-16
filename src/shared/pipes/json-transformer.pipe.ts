import { PipeTransform, Injectable, ArgumentMetadata } from '@nestjs/common';

@Injectable()
export class ParseJSONPipe implements PipeTransform {
  transform(value: any) {
    if (typeof value === 'object' && Object.keys(value).length <= 3) {
      for (const key in value) {
        if (typeof value[key] === 'string' && /\{|\[/.test(value[key])) {
          value[key] = JSON.parse(value[key]);
        } else {
        }
      }
    }
    return value;
  }
}
