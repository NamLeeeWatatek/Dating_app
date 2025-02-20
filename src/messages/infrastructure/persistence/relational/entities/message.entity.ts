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
import { ConversationEntity } from '../../../../../conversations/infrastructure/persistence/relational/entities/conversation.entity';

@Entity({
  name: 'messages',
})
export class MessageEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  senderId: UserEntity['id'];

  @Column()
  receiverId: UserEntity['id'];

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

  @Column()
  conversationId: ConversationEntity['id'];

  @ManyToOne(
    () => ConversationEntity,
    (conversation) => conversation.messages,
    {
      onDelete: 'CASCADE',
    },
  )
  @JoinColumn({ name: 'conversationId' })
  conversation: ConversationEntity;
}
