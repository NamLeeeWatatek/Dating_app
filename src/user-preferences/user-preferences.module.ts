import { Module } from '@nestjs/common';

import { FilesModule } from '../files/files.module';
import { RelationalUserPreferencePersistenceModule } from './infrastructure/persistence/relational/relational-persistence.module';
import { UserPreferencesController } from './user-preferences.controller';
import { UserPreferencesService } from './user-preferences.service';

const infrastructurePersistenceModule =
  RelationalUserPreferencePersistenceModule;

@Module({
  imports: [
    // import modules, etc.
    infrastructurePersistenceModule,
    FilesModule,
  ],
  controllers: [UserPreferencesController],
  providers: [UserPreferencesService],
  exports: [UserPreferencesService, infrastructurePersistenceModule],
})
export class UserPreferencesModule {}
