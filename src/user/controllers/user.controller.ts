import { Controller, Get, Put, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UserService } from 'src/auth/services/user.service';
import { successObj } from 'src/utils';

@Controller('user')
@UseGuards(AuthGuard('jwt'))
export class UserController {
  constructor(private readonly userService: UserService) {}
  @Get('/current')
  async getUserProfile(@Req() req: RequestWithUserPayload) {
    //
    return {
      ...successObj,
      data: req.user,
      meassage: 'retrieved current user successfullly!',
    };
  }
}
