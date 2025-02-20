import { Module } from '@nestjs/common';
import { RelationalConversationPersistenceModule } from './infrastructure/persistence/relational/relational-persistence.module';
import { UsersModule } from '../users/users.module';
import { ConversationController } from './conversation.controller';
import { ConversationService } from './conversation.service';
const infrastructurePersistenceModule = RelationalConversationPersistenceModule;

@Module({
  imports: [infrastructurePersistenceModule, UsersModule],
  controllers: [ConversationController],
  providers: [ConversationService, infrastructurePersistenceModule],
  exports: [ConversationService],
})
export class ConversationModule {}
