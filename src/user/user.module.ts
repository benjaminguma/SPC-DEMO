import { Module } from '@nestjs/common';
import { UserController } from './controllers/user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/auth/model/user.entity';
import { UserNameService } from './services/user-name.service';

@Module({
  controllers: [UserController],
  imports: [TypeOrmModule.forFeature([User])],
  providers: [UserNameService],
  exports: [],
})
export class UserModule {}

//
