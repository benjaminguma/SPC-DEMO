import {
  PublicKeyCredentialCreationOptionsJSON,
  PublicKeyCredentialRequestOptionsJSON,
} from '@simplewebauthn/types';
import {
  IFinalizePasskeyRegistrationPayload,
  IGenerateRegistrationCredentialsPayload,
  INewAuthenticatorPayload,
  ISaveNewCounterPayload,
} from '../types/web-authn.types';
import { User } from 'src/auth/model/user.entity';
import { Passkey } from '../models/passkeys.entity';
import { Challenge } from '../models/challenge.entity';
import { AuthenticationAssertionResponseDTO } from '../dto/web-authn.dto';

export interface IWebAuthnAuthenticationService {
  generatePasskeyAuthenticationOptions(
    userId?: string,
  ): Promise<PublicKeyCredentialRequestOptionsJSON>;

  finalizePasskeyAuthentication(
    data: AuthenticationAssertionResponseDTO,
  ): Promise<User>;
}

export interface IRegistrationWebAuthnService {
  generatePublicKeyCredentialCreationOptions(
    payload: IGenerateRegistrationCredentialsPayload,
  ): Promise<PublicKeyCredentialCreationOptionsJSON>;

  finalizePasskeyRegistration(
    payload: IFinalizePasskeyRegistrationPayload,
  ): Promise<boolean>;
}

export interface IStorageWebAuthnService {
  getUser(userId: string): Promise<User>;

  getUserExistingPasskeys(userId: string): Promise<Passkey[]>;

  getSinglePasskey(credentialId: string): Promise<Passkey>;

  getChallenge(challenge: string): Promise<Challenge>;

  saveNewChallenge(challenge: string): Promise<Challenge>;

  saveNewAuthenticator(payload: INewAuthenticatorPayload): Promise<Passkey>;

  updateCounter(payload: ISaveNewCounterPayload): Promise<Passkey>;

  userIsRegistered(user: User): boolean;
}
