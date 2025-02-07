import { Module } from '@nestjs/common';
import { UsersModule } from '../users/users.module';
import { ProfileService } from './proifiles.service';
import { ProfileController } from './profiles.controller';
import { RelationalProfilePersistenceModule } from './infrastructure/persistence/relational/relational-persistence.module';
const infrastructurePersistenceModule = RelationalProfilePersistenceModule;

@Module({
  imports: [
    // import modules, etc.
    infrastructurePersistenceModule,
    UsersModule,
  ],
  controllers: [ProfileController],
  providers: [ProfileService, infrastructurePersistenceModule],
  exports: [ProfileService],
})
export class ProfileModule {}
