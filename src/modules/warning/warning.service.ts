import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Warning } from './entity/warning.entity';
import { Repository } from 'typeorm';
import { ICreateWarningDto } from './dto/warning.dto';
import { User } from '../user/entity/user.entity';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';

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
}
