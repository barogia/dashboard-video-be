import {
  Column,
  CreateDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export abstract class BaseEntity {
  @PrimaryGeneratedColumn()
  id: string;

  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  @CreateDateColumn({ default: `now()`, nullable: true })
  createdAt: Date;

  @Column()
  createdBy: string;

  @UpdateDateColumn({
    default: `now()`,
    nullable: true,
  })
  updateAt: Date;
}
