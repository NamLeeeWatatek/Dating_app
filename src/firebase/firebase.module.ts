import { Module } from '@nestjs/common';
import { FirebaseStorageService } from './services/firebase-storage.service';

@Module({
  providers: [FirebaseStorageService],
  exports: [FirebaseStorageService],
})
export class FirebaseModule {}
