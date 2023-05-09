import { Exclude } from 'class-transformer';
import { BaseEntity } from 'commons/base.entity';
import { Camera } from 'src/modules/camera/entity/camera.entity';
import { Home } from 'src/modules/home/entity/home.entity';
import { User } from 'src/modules/user/entity/user.entity';
import {
  Column,
  Entity,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Statistic extends BaseEntity {
  @Column()
  time: Date;

  @ManyToMany(() => Camera, (camera) => camera.statistic)
  camera: Camera;

  @ManyToMany(() => Home, (home) => home.statistic)
  home: Home;

  @ManyToMany(() => User, (user) => user.statistic)
  profile: User;
}
