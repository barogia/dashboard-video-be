import { Exclude } from 'class-transformer';
import { BaseEntity } from 'commons/base.entity';
import { WarningLevel } from 'src/commons/constants/enum';
import { Camera } from 'src/modules/camera/entity/camera.entity';
import { Home } from 'src/modules/home/entity/home.entity';
import { Room } from 'src/modules/rooms/entity/room.entity';
import {
  Column,
  Entity,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Warning extends BaseEntity {
  @Column()
  description: string;

  @ManyToMany(() => Home, (home) => home.warning)
  home: Home;

  @ManyToMany(() => Camera, (camera) => camera.warning)
  camera: Camera;

  @Column({ nullable: true })
  warningLevel: WarningLevel;
}
