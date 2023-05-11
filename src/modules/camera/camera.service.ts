import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Camera } from './entity/camera.entity';
import { Repository } from 'typeorm';
import { CreateCameraDTO } from './dto';

@Injectable()
export class CameraService {
  constructor(
    @InjectRepository(Camera) private cameraRepository: Repository<Camera>,
  ) {}

  async createVideo(input: CreateCameraDTO) {
    try {
      const newVideo = await this.cameraRepository.create(input);

      await this.cameraRepository.save(newVideo);
      return newVideo;
    } catch (error) {
      console.log(`Error create video : ${error}`);
    }
  }

  async getAllVideo(limit = 10, offset = 0) {
    try {
      const videos = await this.cameraRepository.find({
        skip: offset,
        take: limit,
      });
      const totalCount = await this.cameraRepository.count();
      return {
        data: videos,
        length: totalCount,
      };
    } catch (error) {}
  }

  async getOneVideo(id: string) {
    try {
      const video = await this.cameraRepository.findOne({
        where: {
          id,
        },
      });

      return {
        data: video,
      };
    } catch (error) {}
  }

  async createMultilple(inputs: CreateCameraDTO[]) {
    try {
      const newVideos = await Promise.all(
        inputs.map((input) => {
          const video = this.cameraRepository.create(input);

          return this.cameraRepository.save(video);
        }),
      );

      return newVideos;
    } catch (error) {
      console.log(`Error create video : ${error}`);
    }
  }

  async deleteVideo(id: string) {
    try {
      const video = await this.cameraRepository.findOne({
        where: {
          id,
        },
      });

      if (!video) {
        throw 'Video not found';
      }

      return await this.cameraRepository.delete(video.id);
    } catch (error) {
      console.log(`Error delete video : ${error}`);
    }
  }

  async updateVideo(id: string, input: CreateCameraDTO) {
    try {
      const video = await this.cameraRepository.update(
        {
          id,
        },
        input,
      );
      return video;
    } catch (error) {}
  }
}
