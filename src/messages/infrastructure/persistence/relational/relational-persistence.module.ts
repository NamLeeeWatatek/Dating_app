import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MessageEntity } from './entities/message.entity';
import { MessageRepository } from '../message.repository';
import { MessageRelationalRepository } from './repositories/message.repository';

@Module({
  imports: [TypeOrmModule.forFeature([MessageEntity])],
  providers: [
    {
      provide: MessageRepository,
      useClass: MessageRelationalRepository,
    },
  ],
  exports: [MessageRepository],
})
export class RelationalMessagePersistenceModule {}
