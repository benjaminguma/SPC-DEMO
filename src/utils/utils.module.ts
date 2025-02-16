import { Global, Module } from '@nestjs/common';
import { UtilsService } from './services/utils.service';

@Global()
@Module({
  controllers: [],
  providers: [UtilsService],
  exports: [UtilsService],
})
export class UtilsModule {}
