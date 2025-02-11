import { Module } from '@nestjs/common';
import { UserPreferenceRepository } from '../user-preference.repository';
import { UserPreferenceRelationalRepository } from './repositories/user-preference.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserPreferenceEntity } from './entities/user-preference.entity';
import { UserEntity } from '../../../../users/infrastructure/persistence/relational/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UserPreferenceEntity, UserEntity])],
  providers: [
    {
      provide: UserPreferenceRepository,
      useClass: UserPreferenceRelationalRepository,
    },
  ],
  exports: [UserPreferenceRepository],
})
export class RelationalUserPreferencePersistenceModule {}
