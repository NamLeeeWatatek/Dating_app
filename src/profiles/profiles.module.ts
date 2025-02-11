import { Module } from '@nestjs/common';
import { UsersModule } from '../users/users.module';
import { ProfileService } from './proifiles.service';
import { ProfileController } from './profiles.controller';
import { RelationalProfilePersistenceModule } from './infrastructure/persistence/relational/relational-persistence.module';
import { FirebaseModule } from '../firebase/firebase.module';
import { FilesFirebaseModule } from '../files/infrastructure/uploader/firebase/files.module';
const infrastructurePersistenceModule = RelationalProfilePersistenceModule;

@Module({
  imports: [
    // import modules, etc.
    FirebaseModule,
    infrastructurePersistenceModule,
    UsersModule,
    FilesFirebaseModule,
  ],
  controllers: [ProfileController],
  providers: [ProfileService, infrastructurePersistenceModule],
  exports: [ProfileService],
})
export class ProfileModule {}
