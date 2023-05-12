import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Camera } from './entity/camera.entity';
import { Repository } from 'typeorm';
import { CreateCameraDTO } from './dto';
import { User } from '../user/entity/user.entity';
import { UserService } from '../user/user.service';
import { countOcurrences, sortOcurrences } from 'src/utils/function';

@Injectable()
export class CameraService {
  constructor(
    @InjectRepository(Camera) private cameraRepository: Repository<Camera>,
    private userService: UserService,
  ) {}

  async createVideo(
    user: User,
    input: CreateCameraDTO & { createdBy?: string },
  ) {
    try {
      // extend input with createdBy field
      input.createdBy = user.id;
      const body = {
        ...input,
        user,
      };
      const newVideo = await this.cameraRepository.create(body);

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
        select: ['user'],
      });

      const userRelation = await Promise.all(
        videos.map(async (video) => {
          const user = await this.userService.getUserByOption({
            where: {
              id: video?.createdBy,
            },
          });
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          const { password, refreshToken, ...rest } = user;
          return rest;
        }),
      );

      const newVideos = videos.map((video, index) => {
        return {
          ...video,
          createdBy: userRelation[index],
        };
      });

      const totalCount = await this.cameraRepository.count();
      return {
        data: newVideos,
        length: totalCount,
      };
    } catch (error) {
      console.log(`Error get all video : ${error}`);
    }
  }

  async getOneVideo(id: string) {
    try {
      const video = await this.cameraRepository.findOne({
        where: {
          id: id,
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
      const foundVideo = await this.cameraRepository.findOne({
        where: {
          id,
        },
      });

      if (foundVideo === null) {
        return {
          data: false,
          message: 'Video not found',
        };
      }

      await this.cameraRepository.update(foundVideo.id, input);

      return {
        data: true,
        message: 'updated success',
      };
    } catch (error) {
      console.log(`error update video : ${error}`);
    }
  }

  async userVideo(limit = 10, offset = 0) {
    try {
      const users = await this.userService.getAllUser();
      const videos = await this.cameraRepository.find({
        skip: offset,
        take: limit,
      });

      const userHasVideos = await Promise.all(
        videos.map(async (video) => {
          const user = await this.userService.getUserByOption({
            where: {
              id: video?.createdBy,
            },
          });
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          const { password, refreshToken, ...rest } = user;
          return rest;
        }),
      );

      const newVideos = videos.map((video, index) => {
        return {
          ...video,
          createdBy: userHasVideos[index],
        };
      });

      const returnVideos = sortOcurrences(
        countOcurrences(newVideos.map((video) => video.createdBy.id)),
      );

      const user = await Promise.all(
        returnVideos.map((item) => {
          return this.userService.getUserByOption({
            where: {
              id: item._id,
            },
          });
        }),
      );

      const userWithVideo = returnVideos.map((item, index) => {
        return {
          ...item,
          user: user[index],
        };
      });

      const allUsers = users.map((user) => {
        if (userWithVideo.some((item) => item.user.id === user.id)) {
          const findCount = userWithVideo.find(
            (item) => item.user.id === user.id,
          ).count;
          return {
            ...user,
            count: findCount,
          };
        }
        return {
          ...user,
          count: 0,
        };
      });

      return {
        data: allUsers,
        length: users,
      };
    } catch (error) {
      console.log(`Error get user video : ${error}`);
    }
  }

  async getVideoByUser(id: string, limit = 10, offset = 0) {
    try {
      const user = await this.userService.getUserByOption({
        where: {
          id,
        },
      });

      const videos = await this.cameraRepository.find({
        skip: offset,
        take: limit,
        where: { createdBy: user.id },
      });

      const totalVideo = await this.cameraRepository.count({
        where: {
          createdBy: user.id,
        },
      });

      return {
        data: videos,
        length: totalVideo,
      };
    } catch (error) {}
  }
}
