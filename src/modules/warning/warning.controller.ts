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
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { WarningService } from './warning.service';
import { ICreateWarningDto } from './dto/warning.dto';
import { JwtAuthenGuard } from 'src/commons/guards/jwt.authen.guard';
import { RequestWithUser } from 'commons/types';
import { FileInterceptor } from '@nestjs/platform-express';
import { Express } from 'express';
import { Multer } from 'multer';
@Controller('warning')
export class WarningController {
  constructor(private readonly warningService: WarningService) {}

  @Get('all')
  async getWarnings(
    @Query('limit', new DefaultValuePipe(10)) limit?: number,
    @Query('offset', new DefaultValuePipe(0)) offset?: number,
  ) {
    return await this.warningService.getWarnings(limit, offset);
  }

  @UseGuards(JwtAuthenGuard)
  @Post()
  async createWarning(
    @Req() request: RequestWithUser,
    @Body() input: ICreateWarningDto,
  ) {
    const user = request.user;
    return await this.warningService.createWarning(user, input);
  }

  @Get(':id')
  async getWarningById(@Param('id') id: string) {
    return await this.warningService.getWarningById(id);
  }

  @Delete(':id')
  async deleteWarningById(@Param('id') id: string) {
    return await this.warningService.deleteWarning(id);
  }
}
