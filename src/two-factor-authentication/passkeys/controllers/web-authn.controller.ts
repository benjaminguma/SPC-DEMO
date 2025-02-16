import {
  Controller,
  Get,
  Post,
  Req,
  UseGuards,
  Body,
  Request,
  Delete,
} from '@nestjs/common';
import { handleCatch, successObj } from 'src/utils';
import { WebAuthnRegistrationService } from '../services/registraction-web-authn.service';
import {
  AuthenticationAssertionResponseDTO,
  GenerateRegistrationOptionsDTO,
  RegistrationResponseDTO,
} from '../dto/web-authn.dto';
import { WebAuthnAuthenticationService } from '../services/authenticatioln-web-authn.service';
import { IGenerateRegistrationCredentialsPayload } from '../types/web-authn.types';
import { AuthGuard } from '@nestjs/passport';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { AuthService } from 'src/auth/services/auth.service';
import { AUTHENTICATION_EVENTS, AuthEvent } from 'src/auth/events/auth.event';
import { RegistrationResponseJSON } from '@simplewebauthn/types';

@Controller('web-authn')
export class WebAuthnController {
  constructor(
    private readonly registrationService: WebAuthnRegistrationService,
    private readonly authenticationService: WebAuthnAuthenticationService,
    private readonly authService: AuthService,
    private readonly emitter: EventEmitter2,
  ) {}
  @UseGuards(AuthGuard('jwt'))
  @Post('generate-registration-options')
  async getRegistrationOptions(
    @Body() data: GenerateRegistrationOptionsDTO,
    @Req() req: RequestWithUserPayload,
  ) {
    const payload: IGenerateRegistrationCredentialsPayload = {
      user: req.user,
      displayName: data.display_name,
    };
    const options =
      await this.registrationService.generatePublicKeyCredentialCreationOptions(
        payload,
      );
    return {
      ...successObj,
      message: 'Passkey registration options generated successfully',
      data: options,
    };
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('finalize-passkey-registration')
  async finalizePasskeyRegistration(
    @Body() data: RegistrationResponseJSON,
    @Req() req: RequestWithUserPayload,
  ) {
    const isSuccessful =
      await this.registrationService.finalizePasskeyRegistration({
        data,
        user: req.user,
      });
    return {
      ...successObj,
      message: 'Passkey registration completed successfully',
      data: isSuccessful,
    };
  }

  @Get('generate-authentication-options')
  async getAuthenticationOptions(@Req() req: RequestWithUserPayload) {
    const options =
      await this.authenticationService.generatePasskeyAuthenticationOptions();
    return {
      ...successObj,
      message: 'Passkey authentication options generated successfully',
      data: options,
    };
  }

  @Post('finalize-passkey-authentication')
  async finalizePasskeyAuthentication(
    @Body() data: AuthenticationAssertionResponseDTO,
  ) {
    const isSuccessful =
      await this.authenticationService.finalizePasskeyAuthentication(data);
    return {
      ...successObj,
      message: 'Passkey registration completed successfully',
      data: isSuccessful,
    };
  }

  @Post('signin')
  async signInWithPasskey(@Body() data: AuthenticationAssertionResponseDTO) {
    const user =
      await this.authenticationService.finalizePasskeyAuthentication(data);
    if (!user) {
      throw new Error('Authentication Failed');
    }
    this.emitter.emitAsync(AUTHENTICATION_EVENTS.LOGIN, new AuthEvent(user));

    // const token = this.authService.SignUserToken(user);
    return {
      ...successObj,
      // token,
      user,
      message: 'logged in successfully',
    };
  }
}
