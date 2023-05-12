import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  DefaultValuePipe,
  Get,
  HttpCode,
  HttpStatus,
  Logger,
  Param,
  Post,
  Query,
  Req,
  Res,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { RequestWithUser } from 'commons/types';
import { JwtRefreshAuthenGuard } from 'src/commons/guards/jwt-refresh.authen.guard';
import { JwtAuthenGuard } from 'src/commons/guards/jwt.authen.guard';
import { LocalAuthenGuard } from 'src/commons/guards/local.authen.guard';
import { UserService } from '../user/user.service';
import { AuthenService } from './authen.service';
import { LoginDto, RegisterUserDto } from './dto/authen.dto';

@Controller('authen')
@UseInterceptors(ClassSerializerInterceptor)
export class AuthenController {
  constructor(
    private readonly authenService: AuthenService,
    private userService: UserService,
  ) {}
  logger = new Logger(AuthenController.name);

  @HttpCode(200)
  @UseGuards(LocalAuthenGuard)
  @Post('login')
  async login(@Req() req: RequestWithUser) {
    const user = req.user;
    const { accessToken, refreshToken } = this.authenService.getAllToken(
      user.id,
    );

    await this.userService.setRefreshToken(user.id, refreshToken);

    return { accessToken, refreshToken };
  }

  @Post('register')
  async register(@Body() input: RegisterUserDto) {
    return await this.authenService.register(input);
  }

  @UseGuards(JwtAuthenGuard)
  @Get('')
  async getAllUser(@Req() req: RequestWithUser) {
    return await this.authenService.getAllUser();
  }

  @Get('getAllActiveUsers')
  async getAllActiveUser() {
    return await this.userService.getAllUser({
      where: {
        isEmailConfirmed: true,
      },
    });
  }

  @Get('delete')
  async deleteAll() {
    return await this.authenService.deleteAllUser();
  }

  @UseGuards(JwtRefreshAuthenGuard)
  @Get('userWithJWTRefreshToken')
  async getCurrentUserWRT(@Req() request) {
    return request?.user;
  }

  @UseGuards(JwtAuthenGuard)
  @Get('userWithToken')
  async getCurrentUserWT(@Req() request) {
    return request?.user;
  }

  @UseGuards(JwtRefreshAuthenGuard)
  @Get('refreshToken')
  async refreshToken(@Req() req: RequestWithUser) {
    const user = req.user;
    const accessToken = this.authenService.getAccessToken(user.id);

    return { accessToken };
  }

  @UseGuards(JwtAuthenGuard)
  @Post('logout')
  async logout(@Req() req: RequestWithUser) {
    const { user } = req;
    return await this.authenService.removeRefreshToken(user.id);
  }

  @Get('ahihi')
  async ahihi() {
    return await this.userService.getAllUser({});
  }

  @Get('all')
  async getAll(
    @Query('limit', new DefaultValuePipe(10)) limit?: number,
    @Query('offset', new DefaultValuePipe(0)) offset?: number,
  ) {
    return await this.userService.getUsers(limit, offset);
  }

  @Get('detail/:id')
  async detailUser(@Param('id') id: string) {
    return await this.authenService.getOneUser(id);
  }
}

// clear cookies
//  'Authentication=; HttpOnly; Path=/; Max-Age=0',
//       'Refresh=; HttpOnly; Path=/; Max-Age=0'
