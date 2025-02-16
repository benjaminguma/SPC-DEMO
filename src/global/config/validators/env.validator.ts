import { EnvVarDTO } from '../dto/env.dto';
import { validateSync } from 'class-validator';
import { plainToInstance } from 'class-transformer';

export function validateENV(config: Record<string, any>) {
  const envChunk = plainToInstance(EnvVarDTO, config);
  console.log(envChunk);
  const res = validateSync(envChunk);
  if (res.length) {
    console.log(res[0].constraints);
    throw new Error(
      'oopsie! environment variables missing,invalid or incomplete, You need to chek your .env file and update your environment variables',
    );
  }

  return envChunk;
}
