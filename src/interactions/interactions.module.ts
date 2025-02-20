import { Module } from '@nestjs/common';
import { RelationalInteractionPersistenceModule } from './infrastructure/persistence/relational/relational-persistence.module';
import { UsersModule } from '../users/users.module';
import { InteractionController } from './interactions.controller';
import { InteractionsService } from './interactions.service';

const infrastructurePersistenceModule = RelationalInteractionPersistenceModule;

@Module({
  imports: [infrastructurePersistenceModule, UsersModule],
  controllers: [InteractionController],
  providers: [InteractionsService, infrastructurePersistenceModule],
  exports: [InteractionsService, infrastructurePersistenceModule],
})
export class InteractionModule {}
