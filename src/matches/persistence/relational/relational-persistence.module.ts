import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MatchesEntity } from './entities/match.entity';
import { MatchRepository } from '../match.repository';
import { MatchesRelationalRepository } from './repositories/match.repository';

@Module({
  imports: [TypeOrmModule.forFeature([MatchesEntity])],
  providers: [
    {
      provide: MatchRepository,
      useClass: MatchesRelationalRepository,
    },
  ],
  exports: [MatchRepository],
})
export class RelationalMatchesPersistenceModule {}
