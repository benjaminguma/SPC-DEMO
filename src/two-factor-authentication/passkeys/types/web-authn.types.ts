import { Passkey } from '../models/passkeys.entity';
import {
  AuthenticationAssertionResponseDTO,
  RegistrationResponseDTO,
} from '../dto/web-authn.dto';
import { User } from 'src/auth/model/user.entity';
import { RegistrationResponseJSON } from '@simplewebauthn/types';

export type IFinalizePasskeyRegistrationPayload = {
  data: RegistrationResponseJSON;
  user: User;
};

export type INewChallengePayload = {
  challenge: string;
};

export type INewAuthenticatorPayload = {
  credentialPublicKey: Uint8Array;
  credentialID: string;
  counter: number;
  user: User;
  name: string;
};

export type IGetSinglePasskeyPayload = {
  credentialId: string;
  userId: string;
};

export type ISaveNewCounterPayload = {
  passkey: Passkey;
  newCounter: number;
};

export type IGenerateRegistrationCredentialsPayload = {
  user: User;
  displayName: string;
};

export type IGenerateWebAuthnJWT = {
  userId: string;
  userName: string;
};
