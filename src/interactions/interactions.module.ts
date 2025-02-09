import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InteractionEntity } from './infrastructure/persistence/relational/entities/interaction.entity';
import { InteractionRepository } from './infrastructure/persistence/interaction.repository';
import { InteractionsRelationalRepository } from './infrastructure/persistence/relational/repositories/interaction.repository';

@Module({
  imports: [TypeOrmModule.forFeature([InteractionEntity])],
  providers: [
    {
      provide: InteractionRepository,
      useClass: InteractionsRelationalRepository,
    },
  ],
  exports: [InteractionRepository],
})
export class RelationalInteractionPersistenceModule {}
