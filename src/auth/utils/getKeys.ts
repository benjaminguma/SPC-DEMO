import * as fs from 'fs';
import * as path from 'path';

const keys = {
  publicKey: fs.readFileSync(
    path.resolve(
      process.cwd(),
      process.env.NODE_ENV === 'production'
        ? 'prod-auth-public.key'
        : 'dev-auth-public.key',
    ),
    {
      encoding: 'utf8',
    },
  ),
  privateKey: fs.readFileSync(
    path.resolve(
      process.cwd(),
      process.env.NODE_ENV === 'production'
        ? 'prod-auth-private.key'
        : 'dev-auth-private.key',
    ),
    {
      encoding: 'utf8',
    },
  ),
};
// ..

export { keys };
