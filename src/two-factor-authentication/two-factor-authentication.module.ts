import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/auth/model/user.entity';
import { WebAuthnRegistrationService } from './passkeys/services/registraction-web-authn.service';
import { Passkey } from './passkeys/models/passkeys.entity';
import { Challenge } from './passkeys/models/challenge.entity';
import { StorageWebAuthnService } from './passkeys/services/storage-web-authn.service';
import { WebAuthnAuthenticationService } from './passkeys/services/authenticatioln-web-authn.service';
import { WebAuthnController } from './passkeys/controllers/web-authn.controller';
import { TwoFactorAuthenticationMethods } from 'src/auth/model/two-factor-authentication.entity';

//comment
@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,
      Passkey,
      Challenge,
      TwoFactorAuthenticationMethods,
    ]),
  ],
  providers: [
    WebAuthnRegistrationService,
    StorageWebAuthnService,
    WebAuthnAuthenticationService,
  ],
  exports: [
    WebAuthnRegistrationService,
    StorageWebAuthnService,
    WebAuthnAuthenticationService,
  ],
  controllers: [WebAuthnController],
})
export class TwoFactorAuthenticationModule {}
