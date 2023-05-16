import { Exclude } from 'class-transformer';
import { BaseEntity } from 'commons/base.entity';
import { WarningLevel } from 'src/commons/constants/enum';
import { Camera } from 'src/modules/camera/entity/camera.entity';
import { Home } from 'src/modules/home/entity/home.entity';
import { Room } from 'src/modules/rooms/entity/room.entity';
import { User } from 'src/modules/user/entity/user.entity';
import {
  Column,
  Entity,
  ManyToMany,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ name: 'warning' })
export class Warning extends BaseEntity {
  @Column()
  description: string;

  @Column()
  name: string;

  @Column()
  urlImage: string;

  @ManyToOne(() => Home, (home) => home.warning)
  home?: Home;

  @ManyToOne(() => Camera, (camera) => camera.warning)
  camera?: Camera;

  @Column({ nullable: true, default: WarningLevel.LOW })
  warningLevel: WarningLevel;

  @ManyToOne(() => User, (user) => user.warning)
  user: User;
}
