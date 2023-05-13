import { Module } from '@nestjs/common';
import { HomeService } from './home.service';
import { HomeController } from './home.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Home } from './entity/home.entity';
import { CameraModule } from '../camera/camera.module';
import { Camera } from '../camera/entity/camera.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Home, Camera])],
  controllers: [HomeController],
  providers: [HomeService],
  exports: [HomeService],
})
export class HomeModule {}
