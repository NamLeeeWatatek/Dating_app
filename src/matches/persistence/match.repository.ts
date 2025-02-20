import { NullableType } from '../../utils/types/nullable.type';
import { Match } from '../domain/match';

export abstract class MatchRepository {
  abstract create(data: Omit<Match, 'id' | 'matchedAt'>): Promise<Match>;

  abstract findById(id: Match['id']): Promise<NullableType<Match>>;

  abstract findByUserIds(
    userId: string,
    matchedUserId: string,
  ): Promise<NullableType<Match>>;

  abstract findByUserId(userId: string): Promise<Match[]>;

  abstract remove(id: Match['id']): Promise<void>;
}
