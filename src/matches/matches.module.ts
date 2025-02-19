import { Module } from '@nestjs/common';
import { UsersModule } from '../users/users.module';
import { ProfileService } from './matches.service';
import { FirebaseModule } from '../firebase/firebase.module';
import { FilesFirebaseModule } from '../files/infrastructure/uploader/firebase/files.module';
import { FilesModule } from '../files/files.module';
const infrastructurePersistenceModule = RelationalProfilePersistenceModule;

@Module({
  imports: [
    // import modules, etc.
    FirebaseModule,
    infrastructurePersistenceModule,
    UsersModule,
    FilesFirebaseModule,
    FilesModule,
  ],
  controllers: [ProfileController],
  providers: [ProfileService, infrastructurePersistenceModule],
  exports: [ProfileService],
})
export class ProfileModule { }
