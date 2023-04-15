import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { User } from '../user/entity/user.entity';
import { Room } from './entity/room.entity';

@Injectable()
export class RoomsService {
  constructor(
    @InjectRepository(Room) private roomRepository: Repository<Room>,
  ) {}

  logger = new Logger(RoomsService.name);

  async findRoomByUsers(users: number[]) {
    try {
      const rooms = await this.roomRepository.find({
        where: {
          members: {
            id: In(users),
          },
        },
        relations: ['members'],
      });

      if (rooms.length === 0)
        return {
          message: 'not found',
        };

      let finalRoom = null as Room;

      for (const room of rooms) {
        const userIds = room.members.map((user) => +user.id);

        const isContainAll = users.every((userId) => userIds.includes(userId));

        if (isContainAll) {
          finalRoom = room;
          break;
        }

        return {
          message: 'not found',
        };
      }

      const modifiedRoom = new Room();
      modifiedRoom.id = finalRoom.id;

      modifiedRoom.members = finalRoom.members.map((user) => {
        const {
          password,
          refreshToken,
          stripeCustomerId,
          isEmailConfirmed,
          ...rest
        } = user;
        return rest;
      });

      return modifiedRoom;
    } catch (error) {
      throw new HttpException(
        `Error in request ${error}`,
        HttpStatus.BAD_GATEWAY,
      );
    }
  }

  async createRoom(users: User[]) {
    try {
      const newRoom = this.roomRepository.create({
        members: users,
      });

      await this.roomRepository.save(newRoom);

      return newRoom;
    } catch (error) {}
  }
}
