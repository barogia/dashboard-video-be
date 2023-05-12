import { Exclude } from 'class-transformer';
import { Camera } from 'src/modules/camera/entity/camera.entity';
import { Home } from 'src/modules/home/entity/home.entity';
import { Room } from 'src/modules/rooms/entity/room.entity';
import { Statistic } from 'src/modules/statistic/entity/statistic.entity';
import {
  Column,
  Entity,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: string;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column({ nullable: true })
  @Exclude()
  password?: string;

  @Column({ default: false })
  isEmailConfirmed?: boolean;

  @Column({ default: false })
  isRegisteredWithGoogle?: boolean;

  @Column({ nullable: true })
  stripeCustomerId?: string;

  @Exclude()
  @Column({ nullable: true })
  refreshToken?: string;

  @ManyToMany(() => Room, (room) => room.members, { nullable: true })
  rooms: Room[];

  @ManyToOne(() => Home, (home) => home.profile, { nullable: true })
  home: Home;

  @ManyToMany(() => Statistic, (statistic) => statistic.profile, {
    nullable: true,
  })
  statistic: Statistic;

  @OneToMany(() => Camera, (camera) => camera.user, { nullable: true })
  camera: Camera[];
}
