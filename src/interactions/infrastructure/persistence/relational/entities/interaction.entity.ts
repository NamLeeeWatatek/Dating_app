import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';
import { InteractionType } from '../../../../../utils/enums/interaction.enum';

@Entity('interactions')
export class InteractionEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid', name: 'sender_id' })
  senderUserId: string;

  @Column({ type: 'uuid', name: 'receiver_id' })
  receiverUserId: string;

  @Column({ type: 'enum', enum: InteractionType })
  type: InteractionType;

  @CreateDateColumn()
  createdAt: Date;
}
