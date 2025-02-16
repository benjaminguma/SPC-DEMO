import { Injectable } from '@nestjs/common';
import { IWebAuthnAuthenticationService } from '../interfaces/web-authn.interface';
import {
  AuthenticationResponseJSON,
  PublicKeyCredentialRequestOptionsJSON,
} from '@simplewebauthn/types';
import { StorageWebAuthnService } from './storage-web-authn.service';
import {
  generateAuthenticationOptions,
  verifyAuthenticationResponse,
  VerifyAuthenticationResponseOpts,
} from '@simplewebauthn/server';
import { handleCatch } from 'src/utils';
import { User } from 'src/auth/model/user.entity';
import { AuthenticationAssertionResponseDTO } from '../dto/web-authn.dto';

@Injectable()
export class WebAuthnAuthenticationService
  implements IWebAuthnAuthenticationService
{
  constructor(private readonly storageService: StorageWebAuthnService) {}

  async generatePasskeyAuthenticationOptions(
    userId?: string,
  ): Promise<PublicKeyCredentialRequestOptionsJSON> {
    try {
      console.log('starting generatePasskeyAuthenticationOptions');
      const userPasskeys =
        await this.storageService.getUserExistingPasskeys(userId);
      // const currentChallenge = await this.storageService.getChallengeByUserId(userId)
      // console.log(userPasskeys)
      const options: PublicKeyCredentialRequestOptionsJSON =
        await generateAuthenticationOptions({
          rpID: this.storageService.rpID,

          allowCredentials: userPasskeys.map((passkey) => ({
            id: passkey.credential_id,
          })),
          userVerification: 'required',
          // challenge: currentChallenge.challenge,
          timeout: 300000,
        });

      await this.storageService.saveNewChallenge(options.challenge);

      return options;
    } catch (error) {
      console.log(error, 'could not verify authentication response');
    }
  }
  async finalizePasskeyAuthentication(
    data: AuthenticationAssertionResponseDTO,
  ): Promise<User> {
    try {
      const currentChallenge = await this.storageService.getChallenge(
        data.challenge,
      );
      console.log('current challenge:', currentChallenge);
      const passkey = await this.storageService.getSinglePasskey(data.id);
      console.log('passkey:', passkey);

      const authenticationResponse: AuthenticationResponseJSON = {
        id: data.id,
        rawId: data.raw_id,
        response: {
          clientDataJSON: data.response.client_data_JSON,
          authenticatorData: data.response.authenticator_data,
          signature: data.response.signature,
          userHandle: data.response.user_handle,
        },
        authenticatorAttachment: data.authenticator_attachment,
        clientExtensionResults: data.client_extension_results,
        type: 'public-key',
      };
      console.log('authentication response', authenticationResponse);

      const options: VerifyAuthenticationResponseOpts = {
        response: authenticationResponse,
        expectedChallenge: currentChallenge.challenge,
        expectedOrigin: this.storageService.origin,
        expectedRPID: this.storageService.rpID,
        credential: {
          id: passkey.credential_id,
          publicKey: passkey.public_key,
          counter: passkey.counter,
        },
        advancedFIDOConfig: {
          userVerification: 'required',
        },
        expectedType: ['webauthn.get', 'payment.get'],
      };
      console.log('options', options);
      const verificationResult = await verifyAuthenticationResponse(options);
      console.log('verification result', verificationResult);
      if (!verificationResult.verified) {
        throw new Error('Unable to verify authentication');
      }

      console.log('updated passkey:');
      console.log(verificationResult);
      const userId = atob(authenticationResponse.response.userHandle);
      const user = await this.storageService.getUser(userId);
      console.log(user);
      return user;
    } catch (error) {
      console.log(error, 'could not verify authentication response');
    }
  }
}
