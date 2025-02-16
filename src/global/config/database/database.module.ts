import { Module } from '@nestjs/common';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { existsSync, readFileSync } from 'node:fs';

//----
@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory(ConfigService: ConfigService) {
        function generateDevelopmentOptions() {
          const options: TypeOrmModuleOptions = {
            type: 'postgres',
            host: ConfigService.getOrThrow('DATABASE_HOST'),
            port: ConfigService.getOrThrow('DATABASE_PORT'),
            username: ConfigService.getOrThrow('DATABASE_USERNAME'),
            password: ConfigService.getOrThrow('DATABASE_PASSWORD'),
            database: ConfigService.getOrThrow('DATABASE_NAME'),
            entities: ['dist/**/*.entity.js'],
            synchronize: true,
            ssl: resolveSSl(),
          };
          function resolveSSl() {
            if (
              existsSync(`${process.cwd()}/ca-certificate.crt`) &&
              ConfigService.getOrThrow('DATABASE_HOST') !== 'postgres' &&
              false
            ) {
              return {
                requestCert: true,
                rejectUnauthorized: true,
                ca: readFileSync(`${process.cwd()}/ca-certificate.crt`, {
                  encoding: 'utf-8',
                }).toString(),
              };
            }

            return undefined;
          }

          return options;
        }

        return generateDevelopmentOptions();
      },
    }),
  ],
})
export class DatabaseModule {}

//
