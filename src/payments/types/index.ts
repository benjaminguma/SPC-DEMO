import { AuthenticationAssertionResponseDTO } from 'src/two-factor-authentication/passkeys/dto/web-authn.dto';

export interface IPaymentAuthorizationReq {
  total: number;
  currency: string;

  transaction_ref: string;

  payer: {
    email: string;
    payment_instrument: {
      type: string;
      data: {
        card_no: string;
        cvv: string;
        expiry: string;
        holders_name: string;
      };
    };

    assertion?: AuthenticationAssertionResponseDTO;
  };
}

const AuthorizationResponseFlags = {
  PAYMENT_APPROVED: 'PAYMENT_APPROVED',
  AUTHENTICATION_REQUIRED: 'AUTHENTICATION_REQUIRED',
} as const;

export interface IPaymentAuthorizationRes {
  details:
    | {
        status: (typeof AuthorizationResponseFlags)['AUTHENTICATION_REQUIRED'];
        credentialRequestOptions?: PublicKeyCredentialRequestOptionsJSON;
        redirect_url?: string;
      }
    | {
        status: (typeof AuthorizationResponseFlags)['PAYMENT_APPROVED'];
        success: true;
      };
}
