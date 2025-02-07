import { NullableType } from '../../../utils/types/nullable.type';
import { DeepPartial } from '../../../utils/types/deep-partial.type';
import { Profile } from '../../domain/profile';
import { FilterProfileDto, SortProfileDto } from '../../dto/query-profile.dto';
import { IPaginationOptions } from '../../../utils/types/pagination-options';

export abstract class ProfileRepository {
  abstract create(
    data: Omit<Profile, 'id' | 'createdAt' | 'deletedAt' | 'updatedAt'>,
  ): Promise<Profile>;
  abstract findManyWithPagination({
    filterOptions,
    sortOptions,
    paginationOptions,
  }: {
    filterOptions?: FilterProfileDto | null;
    sortOptions?: SortProfileDto[] | null;
    paginationOptions: IPaginationOptions;
  }): Promise<Profile[]>;
  abstract findById(id: Profile['id']): Promise<NullableType<Profile>>;
  abstract findByUserId(userId: string): Promise<NullableType<Profile>>;

  abstract update(
    id: Profile['id'],
    payload: DeepPartial<Profile>,
  ): Promise<Profile | null>;

  abstract remove(id: Profile['id']): Promise<void>;
}
