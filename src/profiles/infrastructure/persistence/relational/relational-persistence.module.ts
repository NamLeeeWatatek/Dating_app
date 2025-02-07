import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProfileEntity } from './entities/profile.entity';
import { ProfilesRelationalRepository } from './repositories/profile.repository';
import { ProfileRepository } from '../profile.repository';

@Module({
  imports: [TypeOrmModule.forFeature([ProfileEntity])],
  providers: [
    {
      provide: ProfileRepository,
      useClass: ProfilesRelationalRepository,
    },
  ],
  exports: [ProfileRepository],
})
export class RelationalProfilePersistenceModule {}
