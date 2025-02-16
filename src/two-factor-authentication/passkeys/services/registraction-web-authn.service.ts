import { BadRequestException, Injectable } from '@nestjs/common';
import type {
  PublicKeyCredentialCreationOptionsJSON,
  RegistrationResponseJSON,
} from '@simplewebauthn/types';
import { IRegistrationWebAuthnService } from '../interfaces/web-authn.interface';
import {
  generateRegistrationOptions,
  verifyRegistrationResponse,
  VerifiedRegistrationResponse,
  VerifyRegistrationResponseOpts,
  GenerateRegistrationOptionsOpts,
} from '@simplewebauthn/server';
import {
  IFinalizePasskeyRegistrationPayload,
  IGenerateRegistrationCredentialsPayload,
  INewAuthenticatorPayload,
} from '../types/web-authn.types';
import { StorageWebAuthnService } from './storage-web-authn.service';
import { handleCatch } from 'src/utils';

@Injectable()
export class WebAuthnRegistrationService
  implements IRegistrationWebAuthnService
{
  constructor(private readonly storageService: StorageWebAuthnService) {}

  async generatePublicKeyCredentialCreationOptions(
    payload: IGenerateRegistrationCredentialsPayload,
  ): Promise<PublicKeyCredentialCreationOptionsJSON> {
    try {
      const { user, displayName } = payload;
      const isRegistered = this.storageService.userIsRegistered(user);
      if (isRegistered) {
        throw new Error('User has already registered passkeys');
      }
      const userPasskeys = await this.storageService.getUserExistingPasskeys(
        payload.user.user_id,
      );

      const userIdUnit8Array = user.user_id.split('').map((a) => {
        return a.charCodeAt(0);
      });
      const registrationPayload: GenerateRegistrationOptionsOpts = {
        rpName: this.storageService.rpName,
        rpID: this.storageService.rpID,
        userName: user.email,
        userID: Uint8Array.from(userIdUnit8Array),
        userDisplayName: displayName,
        attestationType: 'direct',
        excludeCredentials: userPasskeys.map((passkey) => ({
          id: passkey.id,
        })),
        authenticatorSelection: {
          requireResidentKey: true,
          userVerification: 'required',
          residentKey: 'required',
          authenticatorAttachment: 'platform',
        },
      };

      //

      console.log(registrationPayload);

      const options: PublicKeyCredentialCreationOptionsJSON =
        await generateRegistrationOptions(registrationPayload);
      console.log(options, 'save new challenge');
      const newChallenge = await this.storageService.saveNewChallenge(
        options.challenge,
      );
      console.log(newChallenge);

      return options;
    } catch (error) {
      console.error('An error occurred:', error);
    }
  }

  async finalizePasskeyRegistration(
    payload: IFinalizePasskeyRegistrationPayload,
  ): Promise<boolean> {
    try {
      const { data, user } = payload;

      const json = JSON.parse(atob(data.response.clientDataJSON));
      if (!json) {
        throw new BadRequestException('invalid payload');
      }
      const currentChallenge = await this.storageService.getChallenge(
        json.challenge,
      );
      // const isRegistered = this.storageService.userIsRegistered(user);
      // if (isRegistered) {
      //   throw new Error('User has already registered passkeys');
      // }
      console.log('creating regResponse object');
      const registrationResponse: RegistrationResponseJSON = data;

      console.log('verifying reg response object');
      const options: VerifyRegistrationResponseOpts = {
        response: registrationResponse,
        expectedChallenge: currentChallenge.challenge,
        expectedOrigin: this.storageService.origin,
        expectedRPID: this.storageService.rpID,
      };
      const verificationResult: VerifiedRegistrationResponse =
        await verifyRegistrationResponse(options);

      if (!verificationResult.verified) {
        throw new Error('Unable to verify registration');
      }
      console.log('saving new authenticator');
      const { credential } = verificationResult.registrationInfo;
      const newAuthenticator: INewAuthenticatorPayload = {
        credentialPublicKey: credential.publicKey,
        credentialID: credential.id,
        counter: 0,
        user: user,
        name: 'macbook device',
      };
      const passkey =
        await this.storageService.saveNewAuthenticator(newAuthenticator);
      console.log(passkey);
      return true;
    } catch (error) {
      console.error(error);
      return handleCatch(error, 'could not verify registration');
    }
  }
}

// comment
