import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
} from 'typeorm';
import { UserEntity } from '../../../../../users/infrastructure/persistence/relational/entities/user.entity';
import { Gender } from '../../../../../utils/enums/gender';

@Entity('profiles')
export class ProfileEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @OneToOne(() => UserEntity, (user) => user.profile, { eager: true })
  @JoinColumn()
  user: UserEntity;

  @Column()
  displayName: string;

  @Column()
  age: number;

  @Column()
  gender: Gender;

  @Column({ nullable: true })
  bio?: string;

  @Column('text', { array: true, nullable: true })
  interests?: string[];

  @Column({ nullable: true })
  avatarUrl?: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
