import { Exclude } from 'class-transformer';
import { BaseEntity } from 'commons/base.entity';
import { SecurityLevel } from 'src/commons/constants/enum';
import { Home } from 'src/modules/home/entity/home.entity';
import { Room } from 'src/modules/rooms/entity/room.entity';
import { Statistic } from 'src/modules/statistic/entity/statistic.entity';
import { User } from 'src/modules/user/entity/user.entity';
import { Warning } from 'src/modules/warning/entity/warning.entity';
import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Camera extends BaseEntity {
  //id == serial
  @Column()
  url: string;

  @Column()
  title: string;

  @Column({ nullable: true, default: SecurityLevel.MEDIUM })
  securityLevel?: SecurityLevel;

  @Column({ nullable: true, default: true })
  connection?: boolean;

  @ManyToOne(() => Home, (home) => home.camera, {
    cascade: ['insert'],
  })
  home?: Home;

  @ManyToMany(() => Warning, (warning) => warning.camera)
  warning?: Warning;

  @ManyToMany(() => Statistic, (statistic) => statistic.camera)
  statistic?: Statistic;

  @JoinTable()
  @ManyToOne(() => User, (user) => user.camera)
  user: User;
}
