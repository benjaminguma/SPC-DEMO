import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
} from 'class-validator';

export default function MutuallyExclusive(
  tag = 'default',
  validationOptions?: ValidationOptions,
  validators?: Array<{ validator: (v: any) => boolean; message: string }>,
) {
  return function (object: object, propertyName: string) {
    const key = tag;

    const existing = Reflect.getMetadata(key, object) || [];

    Reflect.defineMetadata(key, [propertyName, ...tag.split(',')], object);

    registerDecorator({
      name: 'MutuallyExclusive',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [tag],
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          const mutuallyExclusiveProps: Array<string> = tag.split(',');
          console.log(args.constraints);
          let isEmpty = false;
          let isValid = false;
          if (!value) {
            isEmpty = true;
          }
          if (validators) {
            const index = validators.findIndex((e) => {
              return !e.validator(value);
            });
            // console.log({ index });
            if (index > -1) {
              Reflect.defineMetadata(
                'message',
                validators[index].message,
                object,
              );
              isValid = false;
            } else {
              isValid = true;
            }
            //
          }
          const isMutuallyEx =
            mutuallyExclusiveProps.reduce((p: any, c: string) => {
              const x: any = !args.object[c];

              return x && value ? ++p : p;
            }, 0) === mutuallyExclusiveProps.length;

          //   console.log({ isMutuallyEx });
          if (!isEmpty && isMutuallyEx && isValid) {
            return true;
          }
          if (isEmpty && !isMutuallyEx) {
            return true;
          }
          if (isValid && !isMutuallyEx) {
            return false;
          }
          if (isEmpty && !isValid && isMutuallyEx) {
            return true;
          }

          return false;
        },
        defaultMessage(validationArguments?: ValidationArguments) {
          const message = Reflect.getMetadata(
            'message',
            validationArguments.object,
          );
          if (message) {
            return message;
          }
          const mutuallyExclusiveProps: Array<string> = Reflect.getMetadata(
            key,
            validationArguments.object,
          );
          return `Following properties are mutually exclusive: ${mutuallyExclusiveProps.join(
            ', ',
          )}`;
        },
      },
    });
  };
}
