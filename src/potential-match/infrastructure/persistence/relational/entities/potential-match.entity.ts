import {
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  ManyToOne,
  Column,
} from 'typeorm';
import { UserEntity } from '../../../../../users/infrastructure/persistence/relational/entities/user.entity';

@Entity({ name: 'potential_matches' })
export class PotentialMatchEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => UserEntity, (user) => user.potentialMatches, {
    onDelete: 'CASCADE',
  })
  user: UserEntity;

  @ManyToOne(() => UserEntity, { onDelete: 'CASCADE' })
  potentialMatch: UserEntity;

  @Column({ type: 'float', nullable: false })
  matchScore: number;

  @CreateDateColumn()
  createdAt: Date;
}
