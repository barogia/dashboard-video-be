import {
  Body,
  Controller,
  DefaultValuePipe,
  Delete,
  Get,
  Param,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { HomeService } from './home.service';
import { IHomeDTO } from './dto/home.dto';
import { JwtAuthenGuard } from 'src/commons/guards/jwt.authen.guard';
import { RequestWithUser } from 'commons/types';

@Controller('home')
export class HomeController {
  constructor(private readonly homeService: HomeService) {}

  @UseGuards(JwtAuthenGuard)
  @Post()
  async createHome(@Req() request: RequestWithUser, @Body() input: IHomeDTO) {
    const user = request.user;
    return await this.homeService.createHome(user, input);
  }

  @Get()
  async getAllHome(
    @Query('limit', new DefaultValuePipe(10)) limit?: number,
    @Query('offset', new DefaultValuePipe(0)) offset?: number,
  ) {
    return await this.homeService.getall(limit, offset);
  }

  @Get(':id')
  async getHomeById(@Param('id') id: string) {
    return await this.homeService.getOne(id);
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    return await this.homeService.deleteHome(id);
  }

  @Get('video/:id')
  async getVideos(
    @Param('id') id: string,
    @Query('limit', new DefaultValuePipe(10)) limit?: number,
    @Query('offset', new DefaultValuePipe(0)) offset?: number,
  ) {
    return await this.homeService.getVideoByHome(id, limit, offset);
  }
}
