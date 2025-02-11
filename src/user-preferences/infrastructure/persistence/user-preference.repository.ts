import { User } from '../../../users/domain/user';
import { DeepPartial } from '../../../utils/types/deep-partial.type';
import { NullableType } from '../../../utils/types/nullable.type';
import { UserPreference } from '../../domain/user-preference';

export abstract class UserPreferenceRepository {
  abstract create(
    data: Omit<UserPreference, 'id' | 'createdAt' | 'deletedAt' | 'updatedAt'>,
  ): Promise<UserPreference>;

  abstract findByUserId(id: User['id']): Promise<NullableType<UserPreference>>;
  abstract findById(
    id: UserPreference['id'],
  ): Promise<NullableType<UserPreference>>;

  abstract update(
    id: UserPreference['id'],
    payload: DeepPartial<UserPreference>,
  ): Promise<UserPreference | null>;

  abstract remove(id: UserPreference['id']): Promise<void>;
}
