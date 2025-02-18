import { Module } from '@nestjs/common';
import { MessageService } from './message.service';
import { MessageController } from './message.controller';
import { RelationalMessagePersistenceModule } from './infrastructure/persistence/relational/relational-persistence.module';
import { UsersModule } from '../users/users.module';
const infrastructurePersistenceModule = RelationalMessagePersistenceModule;

@Module({
  imports: [infrastructurePersistenceModule, UsersModule],
  controllers: [MessageController],
  providers: [MessageService, infrastructurePersistenceModule],
  exports: [MessageService],
})
export class MessageModule {}
