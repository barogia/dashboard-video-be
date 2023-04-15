import { Exclude } from 'class-transformer';
import { Room } from 'src/modules/rooms/entity/room.entity';
import {
  Column,
  Entity,
  ManyToMany,
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
  isRegisteredWithGoogle: boolean;

  @Column({ nullable: true })
  stripeCustomerId?: string;

  @Exclude()
  @Column({ nullable: true })
  refreshToken?: string;

  @ManyToMany(() => Room, (room) => room.members)
  rooms: Room[];

  //   @JoinColumn()
  //   @OneToOne(() => Address)
  //   address:Address
}
