import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
} from 'typeorm';
import { InteractionType } from '../../utils/enums/interaction.enum';

@Entity({ name: 'interactions' })
export class Interaction {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  senderUserId: string;

  @Column()
  receiverUserId: string;

  @Column({ type: 'enum', enum: InteractionType })
  type: InteractionType;

  @CreateDateColumn()
  createdAt: Date;
}
