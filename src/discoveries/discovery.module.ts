import { Module } from '@nestjs/common';
import { DiscoveryController } from './discovery.controller';
import { DiscoveryService } from './discovery.service';

import { TypeOrmModule } from '@nestjs/typeorm';
import { ProfileEntity } from '../profiles/infrastructure/persistence/relational/entities/profile.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ProfileEntity])],
  controllers: [DiscoveryController],
  providers: [DiscoveryService],
})
export class DiscoveryModule {}
