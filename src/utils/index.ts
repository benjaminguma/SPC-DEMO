import {
  BadRequestException,
  HttpException,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import * as crypto from 'crypto';
import { TypeORMError } from 'typeorm';
import * as nanoid from 'nanoid';
import { ulid } from 'ulid';
import { AxiosError } from 'axios';

export const InvalidStrings = ['true', true, '1', 1];

export const successObj = {
  statusCode: 200,
  status: 'success',
  success: true,
  error: '',
};

const algorithm = 'aes-256-cbc';
let key: string | Buffer = 'FK304jaP2k6P3qAblw1cZNToC1qwBOqgJjIM3QnjG6U=';

const iv = crypto.randomBytes(16);

key = Buffer.from(key, 'base64');

function encrypt(text) {
  const cipher = crypto.createCipheriv(algorithm, key, iv);
  let encrypted = cipher.update(text);
  encrypted = Buffer.concat([encrypted, cipher.final()]);
  return { iv: iv.toString('hex'), encryptedData: encrypted.toString('hex') };
}

export const formatToCurrency = (amount: number) => {
  amount = Math.abs(amount);
  if (isNaN(amount)) amount = 0;
  return (
    '₦' +
    Number(amount)
      .toFixed(2)
      .replace(/\d(?=(\d{3})+\.)/g, '$&,')
  );
};

function decrypt(text) {
  const iv = Buffer.from(text.iv, 'hex');
  const encryptedText = Buffer.from(text.encryptedData, 'hex');

  const decipher = crypto.createDecipheriv(algorithm, Buffer.from(key), iv);

  let decrypted = decipher.update(encryptedText);
  decrypted = Buffer.concat([decrypted, decipher.final()]);

  return decrypted.toString();
}

export async function basicErrorHandler<T>(
  func: () => Promise<T>,
  message: string,
): ReturnType<typeof func> | never {
  try {
    console.log('mayo');
    const result = await func();
    return result;
  } catch (error) {
    console.log(error);
    if (error instanceof TypeORMError) {
      console.log(error.message);

      throw new InternalServerErrorException(message);
    } else if (error instanceof HttpException) {
      throw error;
    }
    throw new InternalServerErrorException();
  }
}

export const handleCatch = (
  error: any,
  message?: string,
  throwErr = true,
  options = {
    handleAxiosError: false,
  },
) => {
  const logger = new Logger();
  logger.error(error);
  console.log(error);
  if (!message) {
    message = error?.message;
  }
  if (error instanceof TypeORMError) {
    logger.error(error.message);
  }
  if (error instanceof AxiosError) {
    logger.error(error.response?.data);

    if (options.handleAxiosError) {
      throw new BadRequestException(
        error.response?.data?.message || error.response?.data?.msg || message,
      );
    }
  }
  if (error instanceof HttpException) {
    throw error;
  }

  throw new InternalServerErrorException(message);
};
export const handleCatch1 = (error: any, message?: string, throwErr = true) => {
  const logger = new Logger();
  logger.error(error);
  if (!message) {
    message = error?.message;
  }
  if (error instanceof TypeORMError) {
    logger.error(error.message);
  }
  if (error instanceof AxiosError) {
    logger.error(error.response.data);
  }
};

export const randomId = (size = 7, enc: BufferEncoding = 'base64url') => {
  return Buffer.from(crypto.randomBytes(size)).toString(enc);
};

export const cloneObj = <T = object>(obj: T): T =>
  JSON.parse(JSON.stringify(obj));
export const entitityCodePrefixes = {
  WALLET: 'WA-',
};

export const toArray = (t: string | string[]) => {
  if (Array.isArray(t)) {
    return t;
  }
  return t.split(',');
};

export const generateULID = () => {
  return ulid();
};

export const zeros = '0000000000000000000000000';
