import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { UserEntity } from '../../../../../users/infrastructure/persistence/relational/entities/user.entity';
import { MessageStatus } from '../../../../enums/status.enum';

@Entity({
  name: 'message',
})
export class MessageEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  senderId: string;

  @Column()
  receiverId: string;

  @Column('text')
  messageContent: string;

  @CreateDateColumn()
  createdAt: Date;

  @Column({ default: 'sent' })
  status: MessageStatus;

  @Column('timestamp', { nullable: true })
  readAt: Date | null;

  @ManyToOne(() => UserEntity, {
    onDelete: 'CASCADE',
    nullable: false,
    eager: false,
  })
  @JoinColumn({ name: 'senderId' })
  sender: UserEntity;

  @ManyToOne(() => UserEntity, {
    onDelete: 'CASCADE',
    nullable: false,
    eager: false,
  })
  receiver: UserEntity;
}
