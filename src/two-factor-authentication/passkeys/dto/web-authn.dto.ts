import {
  AuthenticationResponseJSON,
  AuthenticatorTransportFuture,
  Base64URLString,
  RegistrationResponseJSON,
} from '@simplewebauthn/types';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsBase64,
  IsDefined,
  IsIn,
  IsNotEmpty,
  IsNotEmptyObject,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';

class AuthenticatorAttestationResponseJSON {
  @IsString()
  client_data_JSON: string;

  @IsString()
  attestation_object: string;

  @IsString()
  @IsOptional()
  authenticator_data?: string;

  @IsArray()
  @IsOptional()
  transports?: AuthenticatorTransportFuture[];

  @IsNumber()
  @IsOptional()
  public_key_algorithm?: number;

  @IsString()
  @IsOptional()
  public_key?: string;
}

class AuthenticatorAssertionResponseJSON {
  @IsString()
  client_data_JSON: string;

  @IsString()
  authenticator_data: string;

  @IsString()
  signature: string;

  @IsString()
  user_handle?: string;
}

class BaseResponseDTO {
  @IsString()
  id: string;

  @IsString()
  raw_id: string;

  @IsString()
  @IsOptional()
  @IsIn(['cross-platform', 'platform'])
  authenticator_attachment?: AuthenticatorAttachment;

  @IsObject()
  client_extension_results: AuthenticationExtensionsClientOutputs;

  @IsString()
  @IsIn(['public-key'])
  type: PublicKeyCredentialType;
}

export class RegistrationResponseDTO extends BaseResponseDTO {
  @IsDefined()
  @IsNotEmptyObject()
  @IsObject()
  @ValidateNested()
  @Type(() => AuthenticatorAttestationResponseJSON)
  response: AuthenticatorAttestationResponseJSON;

  @IsString()
  challenge: string;

  @IsString()
  display_name: string;
}

export class AuthenticationAssertionResponseDTO extends BaseResponseDTO {
  @IsDefined()
  @IsNotEmptyObject()
  @IsObject()
  @ValidateNested()
  @Type(() => AuthenticatorAssertionResponseJSON)
  response: AuthenticatorAssertionResponseJSON;

  @IsString()
  @IsNotEmpty()
  challenge: string;
}

export class GenerateRegistrationOptionsDTO {
  @IsString()
  @IsOptional()
  display_name: string;
}
