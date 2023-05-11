import { Exclude } from 'class-transformer';
import { BaseEntity } from 'commons/base.entity';
import { SecurityLevel } from 'src/commons/constants/enum';
import { Home } from 'src/modules/home/entity/home.entity';
import { Room } from 'src/modules/rooms/entity/room.entity';
import { Statistic } from 'src/modules/statistic/entity/statistic.entity';
import { Warning } from 'src/modules/warning/entity/warning.entity';
import {
  Column,
  Entity,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ name: 'camera' })
export class Camera extends BaseEntity {
  //id == serial
  @Column()
  url: string;

  @Column()
  title: string;

  @Column({ nullable: true, default: SecurityLevel.LOW })
  securityLevel?: SecurityLevel;

  @Column({ nullable: true, default: false })
  connection?: boolean;

  @ManyToOne(() => Home, (home) => home.camera)
  home?: Home;

  @ManyToMany(() => Warning, (warning) => warning.camera)
  warning?: Warning;

  @ManyToMany(() => Statistic, (statistic) => statistic.camera)
  statistic?: Statistic;
}
