import { Module } from '@nestjs/common';

import { RelationalPotentialMatchPersistenceModule } from './infrastructure/persistence/relational/relational-persistence.module';
import { PotentialMatchController } from './potential-matches.controller';
import { PotentialMatchService } from './potential-matches.service';

const infrastructurePersistenceModule =
  RelationalPotentialMatchPersistenceModule;

@Module({
  imports: [
    // import modules, etc.
    infrastructurePersistenceModule,
  ],
  controllers: [PotentialMatchController],
  providers: [PotentialMatchService],
  exports: [PotentialMatchService, infrastructurePersistenceModule],
})
export class PotentialMatchModule {}
