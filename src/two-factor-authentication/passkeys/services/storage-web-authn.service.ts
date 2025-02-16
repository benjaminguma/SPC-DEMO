import { User } from 'src/auth/model/user.entity';
import { Repository } from 'typeorm';
import { Challenge } from '../models/challenge.entity';
import { Passkey } from '../models/passkeys.entity';
import { Injectable } from '@nestjs/common';
import { IStorageWebAuthnService } from '../interfaces/web-authn.interface';
import { InjectRepository } from '@nestjs/typeorm';
import {
  INewAuthenticatorPayload,
  ISaveNewCounterPayload,
} from '../types/web-authn.types';
import { UtilsService } from 'src/utils/services/utils.service';
import {
  TwoFactorAuthenticationMethodNames,
  TwoFactorAuthenticationMethods,
} from 'src/auth/model/two-factor-authentication.entity';

@Injectable()
export class StorageWebAuthnService implements IStorageWebAuthnService {
  rpName: string;
  rpID: string;
  origin: string;
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Passkey)
    private readonly passkeyRepository: Repository<Passkey>,
    @InjectRepository(Challenge)
    private readonly challengeRepository: Repository<Challenge>,
    @InjectRepository(TwoFactorAuthenticationMethods)
    private readonly twoFactorAuthMethodRepository: Repository<TwoFactorAuthenticationMethods>,
    private readonly utils: UtilsService,
  ) {
    this.rpName = 'Issuer Bank';
    this.rpID = 'localhost';
    this.origin = `http://${this.rpID}:4300`;
  }
  async saveNewAuthenticator(
    payload: INewAuthenticatorPayload,
  ): Promise<Passkey> {
    try {
      const userPasskeys = await this.getUserExistingPasskeys(
        payload.user.user_id,
      );

      const newPasskey = this.passkeyRepository.create({
        id: userPasskeys[0]?.id || this.utils.generateULID(),
        public_key: payload.credentialPublicKey,
        credential_id: payload.credentialID,
        counter: payload.counter,
        owner: payload.user,
        last_used: new Date(),
      });
      return await this.passkeyRepository.save(newPasskey);
    } catch (error) {
      console.log(error, 'could not save new Authenticator');
    }
  }

  generateAggUid(userId: string) {
    const hash = this.utils.sha512(userId);
    return hash;
  }

  async getUser(userId: string): Promise<User> {
    try {
      const user = await this.userRepository.findOneOrFail({
        where: {
          user_id: userId,
        },
      });
      return user;
    } catch (error) {
      console.log(error, 'could not get user');
    }
  }

  async getUserExistingPasskeys(userId: string): Promise<Passkey[]> {
    try {
      const passkeys = await this.passkeyRepository.find({
        where: {
          owner: {
            user_id: userId,
          },
        },
      });
      return passkeys;
    } catch (error) {
      console.log(error, 'could not get user passkeys');
    }
  }

  async getSinglePasskey(credentialId: string): Promise<Passkey> {
    try {
      const passkey = await this.passkeyRepository.findOneByOrFail({
        credential_id: credentialId,
      });
      return passkey;
    } catch (error) {
      console.log(error, 'could not find passkey matching credential ID');
    }
  }

  async getChallenge(challenge: string): Promise<Challenge> {
    try {
      const foundChallenge = await this.challengeRepository.findOneByOrFail({
        challenge: challenge,
      });
      await this.challengeRepository.remove(foundChallenge);
      return foundChallenge;
    } catch (error) {
      console.log(error, 'could not find a matching challenge');
    }
  }

  async saveNewChallenge(challenge: string): Promise<Challenge> {
    try {
      const newChallenge = this.challengeRepository.create({
        id: this.utils.generateULID(),
        challenge: challenge,
      });
      console.log('nc in save function', newChallenge);
      return await this.challengeRepository.save(newChallenge);
    } catch (error) {
      console.log(error, 'could not save new challenge');
    }
  }

  async updateCounter(payload: ISaveNewCounterPayload): Promise<Passkey> {
    try {
      const { passkey, newCounter } = payload;
      console.log(passkey, newCounter);
      passkey.counter = newCounter;
      passkey.last_used = new Date();
      const updatedPasskey = await this.passkeyRepository.save(passkey);
      return updatedPasskey;
    } catch (error) {
      console.log(error, 'could not save new counter');
    }
  }

  async updateUsertwoFactorAuthSetting(user: User): Promise<User> {
    try {
      const newMethod = await this.twoFactorAuthMethodRepository.create({
        id: this.utils.generateULID(),
        user: user,
        methodName: TwoFactorAuthenticationMethodNames.PASSKEY,
      });
      await this.twoFactorAuthMethodRepository.save(newMethod);
      user.two_fa_methods.push(newMethod);
      return await this.userRepository.save(user);
    } catch (error) {
      console.log(error, 'could not update');
    }
  }

  userIsRegistered(user: User): boolean {
    return user.two_fa_methods?.some(
      (method) =>
        method.methodName === TwoFactorAuthenticationMethodNames.PASSKEY,
    );
  }
}
