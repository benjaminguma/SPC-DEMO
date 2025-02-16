import { Injectable } from '@nestjs/common';
import { ulid } from 'ulid';
import * as crypto from 'crypto';
import { ConfigService } from '@nestjs/config';
import ShortUniqueId from 'short-unique-id';

@Injectable()
export class UtilsService {
  constructor(private readonly configService: ConfigService) {}
  public readonly entitityCodePrefixes = {
    USER: 'USER-',
    IMAGE: 'IMG-',
    DEVICE: 'DEV-',
    USERNAME: 'UN-',
  };

  private shortIdenerator = new ShortUniqueId();

  getPublicURL() {
    return this.configService.getOrThrow<string>('PUBLIC_URL') as string;
  }
  groupInBatches<T>(
    dataSet: T[],
    batchSize: number,
    start: number,
    clb?: (data: T) => any,
  ): { batch: T[]; next: number } {
    const output: T[] = [];
    let count = 0;

    let i = start;
    for (; i < dataSet.length; i++) {
      if (count >= batchSize) {
        break;
      }
      if (clb) {
        clb(dataSet[i]);
      }
      output.push(dataSet[i]);

      count++;
    }

    return { batch: output, next: i < dataSet.length ? i : -1 };
  }

  groupByKeys<T extends object>(dataSet: T[], keys: (keyof T)[] = []) {
    const groupedItems: Record<string, T[]> = {};

    for (const item of dataSet) {
      for (const key of keys) {
        if (key in item) {
          const mainKey = String(item[key]);
          if (!groupedItems[mainKey]) {
            groupedItems[mainKey] = [item];
          } else {
            groupedItems[mainKey].push(item);
          }
        }
      }
    }

    return groupedItems as Record<(typeof keys)[number], T[]>;
  }

  cloneObj(object: object) {
    return JSON.parse(JSON.stringify(object));
  }

  randomId = (size = 7, enc: BufferEncoding = 'base64url') => {
    return Buffer.from(crypto.randomBytes(size)).toString(enc);
  };

  generateVariableId(length?: number) {
    return this.shortIdenerator.randomUUID(length || 18);
  }

  generateULID = () => {
    return ulid();
  };
  generateULIDForEntity = (entityCodePrefix: string) => {
    return entityCodePrefix + ulid();
  };

  toArray = (t: string | string[]) => {
    if (Array.isArray(t)) {
      return t;
    }
    return t.split(',');
  };

  sha512(content: string) {
    return crypto.createHash('sha512').update(content).digest('hex');
  }

  randomString = (length: number): string => {
    const start = 0x41;
    const end = 0x5a;

    let result = '';

    for (let i = 0; i < length; i++) {
      const randomCharCode =
        Math.floor(Math.random() * (end - start + 1)) + start;
      result += String.fromCharCode(randomCharCode);
    }
    //
    return result;
  };

  replaceDynamicPlaceholders(markdown: string, user: Record<string, any>) {
    const placeholderRegex = /{{{(\w+)}}}/g;
    if (!placeholderRegex.test(markdown)) {
      // If no placeholders are found, return the markdown as is
      return markdown;
    }

    return markdown.replace(placeholderRegex, (match, key) => {
      let value = user[key];

      // Logging for debugging
      console.log(`Key: ${key}, Value: ${value}`);

      // Capitalize the firstname and lastname if they exist
      if (key === 'firstname' || key === 'lastname') {
        value = value;
      }

      return value !== undefined ? value : match;
    });
  }
}
