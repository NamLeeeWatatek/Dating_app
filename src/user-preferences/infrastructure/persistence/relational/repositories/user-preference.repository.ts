import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';
import { UserPreferenceEntity } from '../entities/user-preference.entity';
import { NullableType } from '../../../../../utils/types/nullable.type';
import { UserPreference } from '../../../../domain/user-preference';
import { UserPreferenceRepository } from '../../user-preference.repository';
import { User } from '../../../../../users/domain/user';
import { UserPreferenceMapper } from '../mappers/user-preference.mapper';

@Injectable()
export class UserPreferenceRelationalRepository
  implements UserPreferenceRepository
{
  constructor(
    @InjectRepository(UserPreferenceEntity)
    private readonly userPreferenceRepository: Repository<UserPreferenceEntity>,
  ) {}
  async create(data: UserPreference): Promise<UserPreference> {
    const persistenceModel = UserPreferenceMapper.toPersistence(data);
    const newEntity = await this.userPreferenceRepository.save(
      this.userPreferenceRepository.create(persistenceModel),
    );
    return UserPreferenceMapper.toDomain(newEntity);
  }

  async update(
    id: UserPreference['id'],
    payload: Partial<UserPreference>,
  ): Promise<UserPreference> {
    const entity = await this.userPreferenceRepository.findOne({
      where: { id: id },
    });

    if (!entity) {
      throw new Error('User Preferences not found');
    }

    const updatedEntity = await this.userPreferenceRepository.save(
      this.userPreferenceRepository.create(
        UserPreferenceMapper.toPersistence({
          ...UserPreferenceMapper.toDomain(entity),
          ...payload,
        }),
      ),
    );

    return UserPreferenceMapper.toDomain(updatedEntity);
  }

  async remove(id: UserPreference['id']): Promise<void> {
    await this.userPreferenceRepository.softDelete(id);
  }
  async findById(
    id: UserPreference['id'],
  ): Promise<NullableType<UserPreference>> {
    const entity = await this.userPreferenceRepository.findOne({
      where: { id: id },
    });

    return entity ? UserPreferenceMapper.toDomain(entity) : null;
  }

  async findByUserId(
    userId: User['id'],
  ): Promise<NullableType<UserPreference>> {
    const entity = await this.userPreferenceRepository.findOne({
      where: { user: { id: userId } },
      relations: ['user'],
    });

    return entity ? UserPreferenceMapper.toDomain(entity) : null;
  }
}
