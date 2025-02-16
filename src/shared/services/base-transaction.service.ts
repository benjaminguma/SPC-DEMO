import {
  HttpException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { DataSource, EntityManager } from 'typeorm';
import { IsolationLevel } from 'typeorm/driver/types/IsolationLevel';

@Injectable()
export abstract class BaseTransaction {
  constructor(public readonly dataSource: DataSource) {}

  createQueryRunner() {
    return this.dataSource.createQueryRunner();
  }

  async runTransaction<O>(
    handler: (manager: EntityManager) => Promise<O | never>,
    isolationLevel: IsolationLevel = 'READ COMMITTED',
    message = 'failed',
  ): ReturnType<typeof handler> {
    const queryRunner = this.createQueryRunner();
    await queryRunner.connect();
    try {
      await queryRunner.startTransaction(
        isolationLevel === 'READ COMMITTED' ? undefined : isolationLevel,
      );
      const result = await handler(queryRunner.manager);
      await queryRunner.commitTransaction();

      return result;
    } catch (error) {
      console.log(2);
      await queryRunner.rollbackTransaction();
      console.log(error);
      if (error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException(message);
    } finally {
      console.log(1);
      await queryRunner.release();
    }
  }
}
