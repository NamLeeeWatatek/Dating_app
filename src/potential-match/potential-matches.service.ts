import { Injectable } from '@nestjs/common';
import { PotentialMatch } from './domain/potential-match';
import { PotentialMatchRepository } from './infrastructure/persistence/potential-match.repository';
import { NullableType } from '../utils/types/nullable.type';
import { CreatePotentialMatchDto } from './dto/create-potential-match.dto';

@Injectable()
export class PotentialMatchService {
  constructor(
    private readonly potentialMatchRepository: PotentialMatchRepository,
  ) {}

  async createPotentialMatch(
    data: CreatePotentialMatchDto,
  ): Promise<PotentialMatch> {
    return this.potentialMatchRepository.create(PotentialMatch.fromDto(data));
  }

  async getPotentialMatches(
    userId: string,
  ): Promise<NullableType<PotentialMatch[]>> {
    return this.potentialMatchRepository.findByUserId(userId);
  }

  async findByUserPair(
    userId: string,
    potentialMatchId: string,
  ): Promise<NullableType<PotentialMatch>> {
    return this.potentialMatchRepository.findByUserPair(
      userId,
      potentialMatchId,
    );
  }

  async removePotentialMatch(id: string): Promise<void> {
    return this.potentialMatchRepository.remove(id);
  }

  async removeByUserPair(
    userId: string,
    potentialMatchId: string,
  ): Promise<void> {
    return this.potentialMatchRepository.removeByUserPair(
      userId,
      potentialMatchId,
    );
  }

  async checkIfMatchExists(
    userId: string,
    potentialMatchId: string,
  ): Promise<boolean> {
    return this.potentialMatchRepository.exists(userId, potentialMatchId);
  }
}
