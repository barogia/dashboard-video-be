import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Warning } from './entity/warning.entity';
import { Between, Repository } from 'typeorm';
import { ICreateWarningDto } from './dto/warning.dto';
import { User } from '../user/entity/user.entity';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { sortOcurrences } from 'src/utils/function';
import { countOcurrences } from 'src/utils/function';

@Injectable()
export class WarningService {
  constructor(
    @InjectRepository(Warning) private warningRepository: Repository<Warning>,
  ) {}

  async createWarning(user: User, input: ICreateWarningDto) {
    console.log({ input });
    try {
      const warning = this.warningRepository.create({
        ...input,
        home: {
          id: input.home,
        },
        user: {
          id: user.id,
        },
        camera: {
          id: input.camera,
        },
      });

      await this.warningRepository.save(warning);

      return {
        data: warning,
      };
    } catch (error) {
      console.log(`Error in creating warning ${error}`);
    }
  }

  async getWarnings(limit = 10, offset = 0) {
    try {
      const warnings = await this.warningRepository.find({
        skip: offset,
        take: limit,
        relations: ['home', 'camera'],
      });
      const count = await this.warningRepository.count();

      return {
        data: warnings,
        length: count,
      };
    } catch (error) {
      console.log(`Error in getting warnings ${error}`);
    }
  }

  async getWarningById(id: string) {
    try {
      const warning = await this.warningRepository.findOne({
        where: {
          id,
        },
        relations: ['home', 'camera'],
      });

      return {
        data: warning,
      };
    } catch (error) {
      console.log(`Error in getting warning by id ${error}`);
    }
  }

  async deleteWarning(id: string) {
    try {
      const warning = await this.warningRepository.findOne({
        where: {
          id,
        },
      });

      console.log({ warning });
      if (warning === null)
        return {
          success: false,
        };

      await this.warningRepository.delete(warning.id);

      return {
        data: warning,
      };
    } catch (error) {
      console.log(`Error in deleting warning ${error}`);
    }
  }

  async getWarningsByTime(areaId: string, time = 5) {
    // co khu vuc id => get toan bo warnings => count soluong warning theo thang
    try {
      const nextMonth = +time + 1;
      const from = `2023-0${time}-01T00:00:00.000Z`;
      const end = `2023-0${nextMonth}-01T00:00:00.000Z`;

      // get all warnings by month
      const warnings = await this.warningRepository.find({
        where: {
          home: {
            id: areaId,
          },
          createdAt: Between(new Date(from), new Date(end)),
        },
        relations: ['camera', 'home'],
      });

      // count how many warning by date
      const countCameraByDay = sortOcurrences(
        countOcurrences(
          warnings.map((video) =>
            new Date(video.createdAt).getDate().toString(),
          ),
        ),
      );

      return {
        data: countCameraByDay,
      };
    } catch (error) {
      console.log(`Error in getting cameras by warning id ${error}`);
    }
  }
}
