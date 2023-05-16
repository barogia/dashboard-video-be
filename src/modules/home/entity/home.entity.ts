import { Exclude } from 'class-transformer';
import { BaseEntity } from 'commons/base.entity';
import { stat } from 'fs';
import { Camera } from 'src/modules/camera/entity/camera.entity';
import { Statistic } from 'src/modules/statistic/entity/statistic.entity';
import { User } from 'src/modules/user/entity/user.entity';
import { Warning } from 'src/modules/warning/entity/warning.entity';
import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Home extends BaseEntity {
  @Column({ default: true })
  activate: boolean;

  @Column()
  name: string;

  @OneToMany(() => User, (user) => user.home)
  // @JoinTable()
  profile: User;

  @OneToMany(() => Camera, (camera) => camera.home)
  // @JoinTable()
  camera: Camera;

  @OneToMany(() => Warning, (warning) => warning.home)
  warning: Warning;

  @ManyToMany(() => Statistic, (statistic) => statistic.home)
  statistic: Statistic;
}
