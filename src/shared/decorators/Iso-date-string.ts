import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
} from 'class-validator';

// Regular expression to validate ISO date format (YYYY-MM-DD)

export function IsISODate(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'isISODate',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          const isoDatePattern = /^\d{4}-\d{1,2}-\d{1,2}$/;
          if (typeof value !== 'string') {
            return false;
          }
          const valid = isoDatePattern.test(value);
          //
          if (valid) {
            const [_, m, d] = value.split('-');
            if (Number(m) > 12 || Number(d) > 31) {
              return false;
            }
          }
          return valid;
        },
        defaultMessage(args: ValidationArguments) {
          return `${args.property} must be a valid ISO date string (YYYY-MM-DD)`;
        },
      },
    });
  };
}
