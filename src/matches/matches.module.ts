import { Module } from '@nestjs/common';
import { MatchController } from './matches.controller';
import { MatchService } from './matches.service';
import { RelationalMatchesPersistenceModule } from './persistence/relational/relational-persistence.module';
import { MessageModule } from '../messages/message.module';
import { InteractionModule } from '../interactions/interactions.module';
import { UserProfileModule } from '../user-profile/user-profile.module';
const infrastructurePersistenceModule = RelationalMatchesPersistenceModule;

@Module({
  imports: [
    infrastructurePersistenceModule,
    MessageModule,
    InteractionModule,
    UserProfileModule,
  ],
  controllers: [MatchController],
  providers: [MatchService, infrastructurePersistenceModule],
  exports: [MatchService],
})
export class MatchModule {}
