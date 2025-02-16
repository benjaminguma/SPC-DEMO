import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuthCredential } from '../model/auth.credential.entity';
import { UtilsService } from 'src/utils/services/utils.service';
import { handleCatch } from 'src/utils';
import { credentialType } from '../types/otp_types';

@Injectable()
export class AuthCredentialService {
  constructor(
    @InjectRepository(AuthCredential)
    private readonly authCredentials: Repository<AuthCredential>,
    private readonly utils: UtilsService,
  ) {}
  async addCredential(payload: Omit<AuthCredential, 'id'>) {
    try {
      const newCredential = this.authCredentials.create({
        id: this.utils.generateULID(),
        ...payload,
      });
      return await this.authCredentials.save(newCredential);
    } catch (error) {
      return handleCatch(error, 'error occured while creating credential');
    }
  }
  async getCredential(credential: string, type: credentialType) {
    try {
      return await this.authCredentials.findOne({
        where: {
          value: credential,
          crendential_type: type,
        },
      });
    } catch (error) {
      return handleCatch(error, 'error occured while creating credential');
    }
  }

  async updateCredential(data: AuthCredential): Promise<boolean> {
    try {
      await this.authCredentials.save(data);
      return true;
    } catch (error) {
      return handleCatch(error, 'auth credentials update failed');
    }
  }
}
