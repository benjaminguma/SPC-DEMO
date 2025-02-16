import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BlockedUser } from '../model/blocked-user.entity';
import { Repository } from 'typeorm';
import { User } from '../model/user.entity';

@Injectable()
export class BlockedUserService {
  private MAX_FAILED_ATTEMPTS = 5;
  private DEFAULT_BLOCK_TIME = 60 * 1000 * 60 * 5;
  constructor(
    @InjectRepository(BlockedUser)
    private blockedUsers: Repository<BlockedUser>,
  ) {}

  async checkForBlockedUser(userId: string) {
    const blocked = await this.blockedUsers
      .createQueryBuilder('bu')
      .where('bu.id = :uid', { uid: userId })
      .andWhere('bu.blocked_until > :num', { num: Date.now() })
      .getOne();
    return blocked;
  }

  // async blockUser() {}

  async userIsBlocked(user: User) {
    try {
      const now = new Date().getTime();
      const blockedUser = await this.checkForBlockedUser(user.user_id);
      if (!blockedUser) {
        return false;
      }
      if (Number(blockedUser.blocked_until) > now) {
        return true;
      }

      if (
        now >= Number(blockedUser.last_failed_log) + this.DEFAULT_BLOCK_TIME &&
        this.canRetry(blockedUser)
      ) {
        // time have passed and user can start from failed attempt 1
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { updateLastLog, ...rest } = blockedUser;
        await this.blockedUsers.delete(rest);
        return false;
      }

      return false;
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException();
    }
  }
  canRetry(blockedUser: BlockedUser) {
    if (blockedUser.failed_login_attempts < this.MAX_FAILED_ATTEMPTS) {
      return true;
    }
    return false;
  }

  async handleFailedLoginAttempt(user: User) {
    let existing = await this.checkForBlockedUser(user.user_id);
    if (existing) {
      if (this.canRetry(existing)) {
        existing = await this.logFailedAttempts(existing);
      } else {
        existing.blocked_until = new Date().getTime() + this.DEFAULT_BLOCK_TIME;
        this.blockedUsers.save(existing);
      }
    } else {
      existing = await this.createFailedAttempt(user.user_id);
    }
    return this.MAX_FAILED_ATTEMPTS - existing.failed_login_attempts;
  }

  async logFailedAttempts(existingBlockedUser: BlockedUser) {
    try {
      if (
        existingBlockedUser.failed_login_attempts + 1 >
        this.MAX_FAILED_ATTEMPTS
      )
        return existingBlockedUser;
      existingBlockedUser.failed_login_attempts =
        existingBlockedUser.failed_login_attempts + 1;

      existingBlockedUser.last_failed_log = new Date().getTime();
      await this.blockedUsers.save(existingBlockedUser);
      return existingBlockedUser;
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException();
    }
  }

  // async canUserLogin() {}
  async createFailedAttempt(userId: string) {
    try {
      const b = this.blockedUsers.create({
        blocked_until: 0,
        failed_login_attempts: 1,
        id: userId,
        last_failed_log: new Date().getTime(),
      });
      await this.blockedUsers.save(b);
      return b;
    } catch (error) {
      console.log(error);
    }
  }
}
