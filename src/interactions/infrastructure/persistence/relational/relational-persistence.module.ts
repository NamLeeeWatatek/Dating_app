import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InteractionEntity } from './entities/interaction.entity';
import { RedisModule } from '@nestjs-modules/ioredis';
import { InteractionRepository } from '../interaction.repository';
import { InteractionsRelationalRepository } from './repositories/interaction.repository';

@Module({
  imports: [TypeOrmModule.forFeature([InteractionEntity]), RedisModule],
  providers: [
    {
      provide: InteractionRepository,
      useClass: InteractionsRelationalRepository,
    },
  ],
  exports: [InteractionRepository],
})
export class RelationalInteractionPersistenceModule {}
