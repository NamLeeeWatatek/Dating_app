import { User } from '../../../users/domain/user';
import { NullableType } from '../../../utils/types/nullable.type';
import { PotentialMatch } from '../../domain/potential-match';

export abstract class PotentialMatchRepository {
  abstract create(
    data: Omit<PotentialMatch, 'id' | 'createdAt'>,
  ): Promise<PotentialMatch>;

  abstract findByUserId(
    userId: User['id'],
  ): Promise<NullableType<PotentialMatch[]>>;

  abstract findByUserPair(
    userId: User['id'],
    potentialMatchId: User['id'],
  ): Promise<NullableType<PotentialMatch>>;

  abstract remove(id: PotentialMatch['id']): Promise<void>;

  abstract removeByUserPair(
    userId: User['id'],
    potentialMatchId: User['id'],
  ): Promise<void>;

  abstract exists(
    userId: User['id'],
    potentialMatchId: User['id'],
  ): Promise<boolean>;

  abstract updateMatchScore(
    userId: string,
    potentialMatchId: string,
    matchScore: number,
  ): Promise<void>;
}
