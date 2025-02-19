import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProfilesRelationalRepository } from './repositories/match.repository';
import { ProfileRepository } from '../match.repository';
import { MatchesEntity } from './entities/match.entity';

@Module({
  imports: [TypeOrmModule.forFeature([MatchesEntity])],
  providers: [
    {
      provide: ProfileRepository,
      useClass: ProfilesRelationalRepository,
    },
  ],
  exports: [ProfileRepository],
})
export class RelationalMatchesPersistenceModule {}
