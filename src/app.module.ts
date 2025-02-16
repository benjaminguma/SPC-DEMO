import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { validateENV } from './global/config/validators/env.validator';
import { AuthModule } from './auth/auth.module';
import { DatabaseModule } from './global/config/database/database.module';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { UtilsModule } from './utils/utils.module';

import { ScheduleModule } from '@nestjs/schedule';
import { TwoFactorAuthenticationModule } from './two-factor-authentication/two-factor-authentication.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { PaymentModule } from './payments/payments.module';
console.log(join(__dirname, '..', '..', 'public'));

//
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validate: validateENV,
      envFilePath: [
        process.env.NODE_ENV === 'development' ? '.env' : '.env.prod',
      ],
    }),
    EventEmitterModule.forRoot({
      wildcard: true,
    }),
    ScheduleModule.forRoot(),
    AuthModule,
    DatabaseModule,
    UtilsModule,
    TwoFactorAuthenticationModule,
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', '..', 'public'),
      serveRoot: '/public/',
    }),
    PaymentModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
