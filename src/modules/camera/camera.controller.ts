import {
  Body,
  Controller,
  DefaultValuePipe,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { CameraService } from './camera.service';
import { CreateCameraDTO } from './dto';
import { LocalAuthenGuard } from 'src/commons/guards/local.authen.guard';
import { Request } from 'express';
import { RequestWithUser } from 'commons/types';
import { JwtAuthenGuard } from 'src/commons/guards/jwt.authen.guard';

@Controller('camera')
export class CameraController {
  constructor(private readonly cameraService: CameraService) {}

  @Get()
  async GetAll(
    @Query('limit', new DefaultValuePipe(10)) limit?: number,
    @Query('offset', new DefaultValuePipe(0)) offset?: number,
  ) {
    return await this.cameraService.getAllVideo(limit, offset);
  }

  @Get('byUsers')
  async GetAllByUsers(
    @Query('limit', new DefaultValuePipe(10)) limit?: number,
    @Query('offset', new DefaultValuePipe(0)) offset?: number,
  ) {
    return await this.cameraService.userVideo(limit, offset);
  }

  @Get(':id')
  async GetOne(@Param('id') id: string) {
    return await this.cameraService.getOneVideo(id);
  }

  @UseGuards(JwtAuthenGuard)
  @Post()
  async create(
    @Req() request: RequestWithUser,
    @Body() input: CreateCameraDTO,
  ) {
    const { user } = request;
    return await this.cameraService.createVideo(user, input);
  }

  @Post('multiple')
  async createMultilple(@Body() inputs: CreateCameraDTO[]) {
    return await this.cameraService.createMultilple(inputs);
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    return await this.cameraService.deleteVideo(id);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() input: CreateCameraDTO) {
    return await this.cameraService.updateVideo(id, input);
  }

  @Get('user/:id')
  async getVideoByUser(
    @Param('id') id: string,
    @Query('limit', new DefaultValuePipe(10)) limit?: number,
    @Query('offset', new DefaultValuePipe(0)) offset?: number,
  ) {
    return await this.cameraService.getVideoByUser(id, limit, offset);
  }
}
