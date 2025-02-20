import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { MessageEntity } from '../../../../../messages/infrastructure/persistence/relational/entities/message.entity';
import { UserEntity } from '../../../../../users/infrastructure/persistence/relational/entities/user.entity';

@Entity({
  name: 'conversations',
})
export class ConversationEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  user1Id: string;

  @Column('uuid')
  user2Id: string;

  @ManyToOne(() => UserEntity, { nullable: false, eager: true })
  @JoinColumn({ name: 'user1Id' })
  user1: UserEntity;

  @ManyToOne(() => UserEntity, { nullable: false, eager: true })
  @JoinColumn({ name: 'user2Id' })
  user2: UserEntity;

  @Column({ nullable: true })
  lastMessageId: MessageEntity['id'] | null;

  @OneToOne(() => MessageEntity, {
    nullable: true,
    eager: true,
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'lastMessageId' })
  lastMessage: MessageEntity | null;

  @OneToMany(() => MessageEntity, (message) => message.conversation)
  messages: MessageEntity[];
}
