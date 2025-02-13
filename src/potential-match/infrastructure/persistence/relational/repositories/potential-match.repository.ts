import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PotentialMatchEntity } from '../entities/potential-match.entity';

import { PotentialMatchMapper } from '../mappers/potential-match.mapper';
import { PotentialMatchRepository } from '../../potential-match.repository';
import { PotentialMatch } from '../../../../domain/potential-match';
import { UserEntity } from '../../../../../users/infrastructure/persistence/relational/entities/user.entity';

@Injectable()
export class PotentialMatchRelationalRepository
  implements PotentialMatchRepository
{
  constructor(
    @InjectRepository(PotentialMatchEntity)
    private readonly potentialMatchRepository: Repository<PotentialMatchEntity>,
  ) {}

  async create(data: PotentialMatch): Promise<PotentialMatch> {
    const newMatch = this.potentialMatchRepository.create({
      user: { id: data.userId } as UserEntity,
      potentialMatch: { id: data.potentialMatchId } as UserEntity,
      matchScore: data.matchScore,
    });
    const savedMatch = await this.potentialMatchRepository.save(newMatch);
    return PotentialMatchMapper.toDomain(savedMatch);
  }

  async findByUserId(userId: string): Promise<PotentialMatch[]> {
    const matches = await this.potentialMatchRepository.find({
      where: { user: { id: userId } },
      relations: ['potentialMatch'],
    });
    return matches.map(PotentialMatchMapper.toDomain);
  }

  async findByUserPair(
    userId: string,
    potentialMatchId: string,
  ): Promise<PotentialMatch | null> {
    const match = await this.potentialMatchRepository.findOne({
      where: { user: { id: userId }, potentialMatch: { id: potentialMatchId } },
    });
    return match ? PotentialMatchMapper.toDomain(match) : null;
  }

  async remove(id: string): Promise<void> {
    await this.potentialMatchRepository.delete(id);
  }

  async removeByUserPair(
    userId: string,
    potentialMatchId: string,
  ): Promise<void> {
    await this.potentialMatchRepository.delete({
      user: { id: userId },
      potentialMatch: { id: potentialMatchId },
    } as any);
  }

  async exists(userId: string, potentialMatchId: string): Promise<boolean> {
    const count = await this.potentialMatchRepository.count({
      where: { user: { id: userId }, potentialMatch: { id: potentialMatchId } },
    });
    return count > 0;
  }

  async updateMatchScore(
    userId: string,
    potentialMatchId: string,
    matchScore: number,
  ): Promise<void> {
    await this.potentialMatchRepository.update(
      { user: { id: userId }, potentialMatch: { id: potentialMatchId } },
      { matchScore },
    );
  }
}
