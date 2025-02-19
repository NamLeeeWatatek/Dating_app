import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  CreateDateColumn,
  Unique,
} from 'typeorm';
import { UserEntity } from '../../../../user-preferences/infrastructure/persistence/relational/entities/user-preference.entity';

@Entity('matches')
@Unique(['user', 'matchedUser']) // Đảm bảo không có match trùng
export class MatchesEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => UserEntity, (user) => user.matches, { onDelete: 'CASCADE' })
  user: UserEntity;

  @ManyToOne(() => UserEntity, { onDelete: 'CASCADE' })
  matchedUser: UserEntity;

  @CreateDateColumn()
  matchedAt: Date;
}
