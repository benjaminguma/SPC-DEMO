import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
} from 'class-validator';

export function IsOneOf(
  validationOptions?: ValidationOptions,
  validators?: Array<{ validator: (v: any) => boolean; message: string }>,
) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'isOneOf',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          const valid = validators.some((v) => v.validator(value));
          return typeof value === 'string' && valid; // you can return a Promise<boolean> here as well, if you want to make async validation
        },
      },
    });
  };
}
