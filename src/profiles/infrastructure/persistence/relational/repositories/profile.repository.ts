import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, Repository, In } from 'typeorm';

import { ProfileEntity } from '../entities/profile.entity';
import { NullableType } from '../../../../../utils/types/nullable.type';
import {
  FilterProfileDto,
  SortProfileDto,
} from '../../../../dto/query-profile.dto';
import { Profile } from '../../../../domain/profile';
import { ProfileRepository } from '../../profile.repository';
import { ProfileMapper } from '../mappers/profile.mapper';
import { IPaginationOptions } from '../../../../../utils/types/pagination-options';

@Injectable()
export class ProfilesRelationalRepository implements ProfileRepository {
  constructor(
    @InjectRepository(ProfileEntity)
    private readonly profilesRepository: Repository<ProfileEntity>,
  ) {}

  async create(data: Profile): Promise<Profile> {
    const persistenceModel = ProfileMapper.toPersistence(data);
    const newEntity = await this.profilesRepository.save(
      this.profilesRepository.create(persistenceModel),
    );
    return ProfileMapper.toDomain(newEntity);
  }

  async findManyWithPagination({
    filterOptions,
    sortOptions,
    paginationOptions,
  }: {
    filterOptions?: FilterProfileDto | null;
    sortOptions?: SortProfileDto[] | null;
    paginationOptions: IPaginationOptions;
  }): Promise<{ data: Profile[]; totalItems: number }> {
    const where: FindOptionsWhere<ProfileEntity> = {};

    if (filterOptions?.users?.length) {
      where.user = { id: In(filterOptions.users.map((id) => Number(id))) };
    }

    const [entities, totalItems] = await this.profilesRepository.findAndCount({
      skip: (paginationOptions.page - 1) * paginationOptions.limit,
      take: paginationOptions.limit,
      where,
      order: sortOptions?.reduce(
        (accumulator, sort) => ({
          ...accumulator,
          [sort.orderBy]: sort.order,
        }),
        {},
      ),
    });

    return {
      data: entities.map((profile) => ProfileMapper.toDomain(profile)),
      totalItems,
    };
  }

  async findById(id: Profile['id']): Promise<NullableType<Profile>> {
    const entity = await this.profilesRepository.findOne({
      where: { id: id },
    });

    return entity ? ProfileMapper.toDomain(entity) : null;
  }

  async findByIds(ids: Profile['id'][]): Promise<Profile[]> {
    const entities = await this.profilesRepository.find({
      where: { id: In(ids) },
    });

    return entities.map((profile) => ProfileMapper.toDomain(profile));
  }

  async findByUserId(userId: Profile['id']): Promise<NullableType<Profile>> {
    const entity = await this.profilesRepository.findOne({
      where: { user: { id: userId } },
    });

    return entity ? ProfileMapper.toDomain(entity) : null;
  }

  async update(id: Profile['id'], payload: Partial<Profile>): Promise<Profile> {
    const entity = await this.profilesRepository.findOne({
      where: { id: id },
    });

    if (!entity) {
      throw new Error('Profile not found');
    }

    const updatedEntity = await this.profilesRepository.save(
      this.profilesRepository.create(
        ProfileMapper.toPersistence({
          ...ProfileMapper.toDomain(entity),
          ...payload,
        }),
      ),
    );

    return ProfileMapper.toDomain(updatedEntity);
  }

  async remove(id: Profile['id']): Promise<void> {
    await this.profilesRepository.softDelete(id);
  }
}
