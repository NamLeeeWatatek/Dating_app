import { Module } from '@nestjs/common';
import { DiscoveryController } from './discovery.controller';
import { DiscoveryService } from './discovery.service';

import { TypeOrmModule } from '@nestjs/typeorm';
import { ProfileEntity } from '../profiles/infrastructure/persistence/relational/entities/profile.entity';
import { UserPreferenceEntity } from '../user-preferences/infrastructure/persistence/relational/entities/user-preference.entity';
import { InteractionEntity } from '../interactions/infrastructure/persistence/relational/entities/interaction.entity';
import { UserPreferencesModule } from '../user-preferences/user-preferences.module';
import { ProfileModule } from '../profiles/profiles.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([ProfileEntity]),
    TypeOrmModule.forFeature([UserPreferenceEntity]),
    TypeOrmModule.forFeature([InteractionEntity]),
    UserPreferencesModule,
    ProfileModule,
  ],
  controllers: [DiscoveryController],
  providers: [DiscoveryService],
})
export class DiscoveryModule {}
