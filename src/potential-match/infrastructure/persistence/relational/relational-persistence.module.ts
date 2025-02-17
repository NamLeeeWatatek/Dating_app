import { Module } from '@nestjs/common';
import { PotentialMatchRepository } from '../potential-match.repository';
import { PotentialMatchRelationalRepository } from './repositories/potential-match.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PotentialMatchEntity } from './entities/potential-match.entity';

@Module({
  imports: [TypeOrmModule.forFeature([PotentialMatchEntity])],
  providers: [
    {
      provide: PotentialMatchRepository,
      useClass: PotentialMatchRelationalRepository,
    },
  ],
  exports: [PotentialMatchRepository],
})
export class RelationalPotentialMatchPersistenceModule {}
