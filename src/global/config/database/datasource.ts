import { readFileSync } from 'fs';
import { DataSource } from 'typeorm';

// process.env is going  to resolve only when inside container so starting  the app normally would mean you cant run migrations because all the environment variables would yield nothing

// export default new DataSource({
//   type: 'postgres',
//   host: process.env.DATABASE_HOST as string,
//   port: process.env.DATABASE_PORT as unknown as number,
//   username: process.env.DATABASE_USERNAME as string,
//   password: process.env.DATABASE_PASSWORD,
//   database: process.env.DATABASE_NAME,
//   entities: ['dist/**/*.entity.js'],
//   synchronize: false,
//   ssl:
//     process.env.NODE_ENV === 'production'
//       ? {
//           requestCert: true,
//           rejectUnauthorized: true,
//           ca: readFileSync(`${process.cwd()}/ca-certificate.crt`, {
//             encoding: 'utf-8',
//           }).toString(),
//         }
//       : undefined,

//   migrations: ['dist/global/config/database/migration/*.js'],
// });
