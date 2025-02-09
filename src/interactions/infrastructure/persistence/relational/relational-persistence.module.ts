import { Module } from '@nestjs/common';
import { RelationalInteractionPersistenceModule } from '../../../interactions.module';
import { InteractionController } from '../../../interactions.controller';
import { InteractionsService } from '../../../interactions.service';
import { UsersModule } from '../../../../users/users.module';

const infrastructurePersistenceModule = RelationalInteractionPersistenceModule;

@Module({
  imports: [infrastructurePersistenceModule, UsersModule],
  controllers: [InteractionController],
  providers: [InteractionsService, infrastructurePersistenceModule],
  exports: [InteractionsService],
})
export class InteractionModule {}
