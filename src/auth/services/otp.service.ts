import {
  BadRequestException,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';

import { Otp } from '../model/otp.entity';
import * as crypto from 'node:crypto';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { handleCatch } from 'src/utils';

import { OTP_CODE_TYPES, credentialType } from '../types/otp_types';
import { OtpVerificationnDTO } from '../dto/passwordless/login';
import axios from 'axios';

const FIVE_MINS = 60 * 1000 * 5;
const MAX_ATTEMPTS = 4;

@Injectable()
export class OtpService {
  private readonly logger = new Logger(OtpService.name);

  constructor(
    @InjectRepository(Otp) private readonly OTPColl: Repository<Otp>,
  ) {}
  private generateOTP() {
    const digits = '0123456789';

    if (process.env.NODE_ENV === 'development') {
      return '123456';
    }

    let OTP = '';
    for (let i = 0; i < 6; i++) {
      OTP += digits[Math.floor(Math.random() * 10)];
    }
    return OTP;
  }

  async verifyOTP(
    { otp, token, field, type: codeType }: OtpVerificationnDTO,
    type: credentialType,
  ) {
    try {
      if (type === 'phonenumber') {
        const verified = true;
        if (!verified) {
          throw new BadRequestException('verification failed');
        }
        return verified;
      }
      const { OTPHash, valueHash } = this._srambleValueAndOTP(field, otp);

      let otpItemInDb = await this.OTPColl.findOne({
        where: {
          otp_id: token,
          type: codeType,
        },
      });
      if (!otpItemInDb) {
        throw new UnauthorizedException(
          'something went wrong during otp verification',
        );
      }

      const expired = new Date().getTime() > Number(otpItemInDb.expires);

      if (
        otpItemInDb.grantee === valueHash &&
        otpItemInDb.code === OTPHash &&
        !expired
      )
        return true;
      if (expired) {
        await this.OTPColl.delete(otpItemInDb);
        throw new UnauthorizedException(
          'authentication failed otp session expired',
        );
      }
      if (otpItemInDb.failed_attempts > MAX_ATTEMPTS) {
        await this.OTPColl.delete(otpItemInDb.otp_id);
        throw new UnauthorizedException('something went wrong at this time');
      }
      otpItemInDb.failed_attempts = otpItemInDb.failed_attempts + 1;

      otpItemInDb = await this.OTPColl.save(otpItemInDb);

      throw new UnauthorizedException(
        `failed to authenticate ${
          MAX_ATTEMPTS - (otpItemInDb.failed_attempts - 1)
        } attempt(s) left`,
      );
    } catch (error) {
      return handleCatch(error, 'otp verification failed');
    }
  }
  private _srambleValueAndOTP(
    value: string,
    OTP: string,
  ): { OTPHash: string; valueHash: string } {
    const OTPHash = crypto.createHash('sha256').update(OTP).digest('hex');
    const valueHash = crypto
      .createHmac('sha256', '19n0-')
      .update(value)
      .digest('hex');

    return {
      OTPHash,
      valueHash,
    };
  }

  async CreateAndStoreOTP(OTP: string, value: string, type: OTP_CODE_TYPES) {
    try {
      const { OTPHash, valueHash } = this._srambleValueAndOTP(value, OTP);
      await this.OTPColl.delete({
        grantee: valueHash,
      });

      let doc = this.OTPColl.create({
        grantee: valueHash,
        code: OTPHash,
        expires: new Date().getTime() + FIVE_MINS,
        failed_attempts: 0,
        type,
      });
      doc = await this.OTPColl.save(doc);

      return doc.otp_id.toString();
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async processOTP(
    value: string,
    codeType: OTP_CODE_TYPES,
    type: credentialType = 'email',
  ) {
    if (type === 'email') {
      const OTP = this.generateOTP();
      const id = await this.CreateAndStoreOTP(OTP, value, codeType);
      // await axios.post(
      //   'https://us-central1-awesome-project-5cb2a.cloudfunctions.net/processEmail',
      //   {
      //     title: `your otp is ${OTP}`,
      //     body: `<p>please use <b>${OTP}</b> to login </p>`,
      //     recipients: [value],
      //   },
      // );
      return id;
    } else if (type === 'phonenumber') {
      const id = '';
      return id;
    }
  }
}
