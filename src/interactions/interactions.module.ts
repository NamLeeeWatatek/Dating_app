import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InteractionEntity } from './infrastructure/persistence/relational/entities/interaction.entity';
import { InteractionRepository } from './infrastructure/persistence/interaction.repository';
import { InteractionsRelationalRepository } from './infrastructure/persistence/relational/repositories/interaction.repository';
import { RedisService } from '../redis/redis.service';
import { RedisModule } from '../redis/redis.module';

@Module({
  imports: [TypeOrmModule.forFeature([InteractionEntity]), RedisModule],
  providers: [
    {
      provide: InteractionRepository,
      useClass: InteractionsRelationalRepository,
    },
    RedisService, // Thêm RedisService vào providers
  ],
  exports: [InteractionRepository, RedisService], // Export RedisService để dùng ở module khác
})
export class RelationalInteractionPersistenceModule {}
