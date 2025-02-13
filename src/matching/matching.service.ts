import { Injectable } from '@nestjs/common';

import { UserPreference } from '../user-preferences/domain/user-preference';
import { UserPreferenceRepository } from '../user-preferences/infrastructure/persistence/user-preference.repository';

@Injectable()
export class MatchingService {
  constructor(
    private readonly userPreferenceRepository: UserPreferenceRepository,
  ) {}

  async getMatchScore(userAId: string, userBId: string): Promise<number> {
    const userA = await this.userPreferenceRepository.findByUserId(userAId);
    const userB = await this.userPreferenceRepository.findByUserId(userBId);

    if (!userA || !userB) {
      throw new Error('User preferences not found');
    }

    return this.calculateMatchScore(userA, userB);
  }

  private countMatches(arr1: string[], arr2: string[]): number {
    return arr1.filter((value) => arr2.includes(value)).length;
  }

  private calculateMatchScore(
    userA: UserPreference,
    userB: UserPreference,
  ): number {
    let score = 0;

    score += this.countMatches(userA.hobbies, userB.hobbies) * 5;
    score += this.countMatches(userA.languages, userB.languages) * 5;
    score += this.countMatches(userA.education, userB.education) * 8;
    score += this.countMatches(userA.smoking, userB.smoking) * 10;
    score += this.countMatches(userA.drinking, userB.drinking) * 3;
    score += this.countMatches(userA.exercise, userB.exercise) * 8;
    score += this.countMatches(userA.diet, userB.diet) * 10;

    return score;
  }
}
