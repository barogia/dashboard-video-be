import {
  Body,
  Controller,
  DefaultValuePipe,
  Delete,
  Get,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { CameraService } from './camera.service';
import { CreateCameraDTO } from './dto';

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

  @Get(':id')
  async GetOne(@Query('id') id: string) {
    return await this.cameraService.getOneVideo(id);
  }

  @Post()
  async create(@Body() input: CreateCameraDTO) {
    return await this.cameraService.createVideo(input);
  }

  @Post('multiple')
  async createMultilple(@Body() inputs: CreateCameraDTO[]) {
    return await this.cameraService.createMultilple(inputs);
  }

  @Delete(':id')
  async delete(@Query('id') id: string) {
    return await this.cameraService.deleteVideo(id);
  }

  @Patch(':id')
  async update(@Query('id') id: string, @Body() input: CreateCameraDTO) {
    return await this.cameraService.updateVideo(id, input);
  }
}
