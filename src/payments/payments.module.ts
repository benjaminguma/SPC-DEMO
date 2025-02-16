import { Module } from '@nestjs/common';
import { PaymentController } from './controllers/payment.controller';
import { AuthModule } from 'src/auth/auth.module';
import { TwoFactorAuthenticationModule } from 'src/two-factor-authentication/two-factor-authentication.module';
import { UserModule } from 'src/user/user.module';

@Module({
  controllers: [PaymentController],
  providers: [],

  imports: [UserModule, TwoFactorAuthenticationModule],
})
export class PaymentModule {}
