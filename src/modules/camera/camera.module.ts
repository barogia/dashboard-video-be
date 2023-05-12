import { Module } from '@nestjs/common';
import { CameraService } from './camera.service';
import { CameraController } from './camera.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Camera } from './entity/camera.entity';
import { UserModule } from '../user/user.module';

@Module({
  imports: [TypeOrmModule.forFeature([Camera]), UserModule],
  controllers: [CameraController],
  providers: [CameraService],
})
export class CameraModule {}
