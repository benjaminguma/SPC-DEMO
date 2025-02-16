import {
  BadRequestException,
  Body,
  Controller,
  Get,
  NotFoundException,
  Post,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { IPaymentAuthorizationReq, IPaymentAuthorizationRes } from '../types';
import { UserService } from 'src/auth/services/user.service';
import { WebAuthnAuthenticationService } from 'src/two-factor-authentication/passkeys/services/authenticatioln-web-authn.service';
import { WebAuthnRegistrationService } from 'src/two-factor-authentication/passkeys/services/registraction-web-authn.service';

@Controller('/payment')
export class PaymentController {
  constructor(
    private readonly userService: UserService,
    private readonly passkeyAuthService: WebAuthnAuthenticationService,
  ) {}

  @Post('/request-authorization')
  async handleApplePaymentWebhook(@Body() data: IPaymentAuthorizationReq) {
    console.log('puplu');
    if (!data.payer?.email || !data.total || !data.currency) {
      throw new BadRequestException();
    }

    const user = await this.userService.getUser({
      where: { email: data.payer.email },
    });

    if (!user) {
      throw new NotFoundException();
    }

    // low risk transactions shouuld be confirmed automatically
    if (data.total < 20) {
      return {
        details: {
          status: 'PAYMENT_APPROVED',
          success: true,
        },
      } as IPaymentAuthorizationRes;
    }

    // high risk transaction

    // already provided assertion verify and complete payment
    if (data.payer.assertion) {
      try {
        // verify customers assertion
        await this.passkeyAuthService.finalizePasskeyAuthentication(
          data.payer.assertion,
        );

        return {
          details: {
            status: 'PAYMENT_APPROVED',
            success: true,
          },
        } as IPaymentAuthorizationRes;
      } catch (error) {
        throw new UnauthorizedException('payment authorization failed');
      }
    }

    // user already has passkeys so send credential request options for asssertion

    const credentialRequestOptions =
      await this.passkeyAuthService.generatePasskeyAuthenticationOptions(
        user.user_id,
      );

    if (!credentialRequestOptions.allowCredentials.length) {
      // user does not have a passkey, they need to be redirected to issuer portal to create credential
      return {
        details: {
          status: 'AUTHENTICATION_REQUIRED',
          redirect_url: `http://localhost:4300/public/create-cred.htm?email=${user.email}`,
        },
      } as IPaymentAuthorizationRes;
    }

    // user has credentials make them authenticate the payment
    return {
      details: {
        status: 'AUTHENTICATION_REQUIRED',
        credentialRequestOptions,
        redirect_url: '',
      },
    } as IPaymentAuthorizationRes;
  }
}
