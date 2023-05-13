import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Home } from './entity/home.entity';
import { FindManyOptions, Repository } from 'typeorm';
import { IHomeDTO } from './dto/home.dto';
import { User } from '../user/entity/user.entity';
import { CameraService } from '../camera/camera.service';
import { Camera } from '../camera/entity/camera.entity';

@Injectable()
export class HomeService {
  constructor(
    @InjectRepository(Home) private homeRepository: Repository<Home>,
    @InjectRepository(Camera) private cameraRepository: Repository<Camera>,
  ) {}

  async createHome(user: User, input: IHomeDTO & { createdBy?: string }) {
    try {
      input.createdBy = user.id;
      const body = {
        ...input,
        profile: user,
      };
      const home = await this.homeRepository.create(body);

      await this.homeRepository.save(home);

      return {
        data: home,
      };
    } catch (error) {
      console.log(`Error creating home : ${error}`);
    }
  }

  async getall(limit = 10, offset = 0, options?: FindManyOptions<Home>) {
    try {
      options = {
        ...options,
        skip: offset,
        take: limit,
        relations: ['profile', 'camera'],
      };
      const homes = await this.homeRepository.find(options);
      const length = await this.homeRepository.count();
      return {
        data: homes,
        length: length,
      };
    } catch (error) {
      console.log(`Error get all home : ${error}`);
    }
  }

  async getVideosByHome(id: string, limit = 10, offset = 0) {
    try {
      const videos = await this.cameraRepository.find({
        skip: offset,
        take: limit,
        where: {
          home: {
            id,
          },
        },
        relations: ['user'],
      });

      const totalVideo = await this.cameraRepository.count({
        where: {
          home: {
            id,
          },
        },
      });

      return {
        data: videos,
        length: totalVideo,
      };
    } catch (error) {}
  }

  async getVideoByHome(id: string, limit = 10, offset = 0) {
    try {
      const home = await this.homeRepository.findOne({
        where: {
          id,
        },
      });

      const videos = await this.getVideosByHome(home.id, limit, offset);

      return {
        data: videos.data,
        length: videos.length,
      };
    } catch (error) {}
  }

  async getOne(id: string) {
    try {
      const home = await this.homeRepository.findOne({
        where: {
          id,
        },
      });

      return {
        data: home,
      };
    } catch (error) {}
  }

  async deleteHome(id: string) {
    try {
      const video = await this.homeRepository.findOne({
        where: {
          id,
        },
      });

      if (!video) {
        throw 'Home not found';
      }

      return await this.homeRepository.delete(video.id);
    } catch (error) {
      console.log(`Error delete Home : ${error}`);
    }
  }
}
