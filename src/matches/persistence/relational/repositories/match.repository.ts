import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { MatchesEntity } from '../entities/match.entity';
import { MatchRepository } from '../../match.repository';
import { Match } from '../../../domain/match';
import { MatchMapper } from '../mappers/match.mapper';

@Injectable()
export class MatchesRelationalRepository implements MatchRepository {
  constructor(
    @InjectRepository(MatchesEntity)
    private readonly matchRepo: Repository<MatchesEntity>,
  ) {}

  async create(data: Omit<Match, 'id' | 'matchedAt'>): Promise<Match> {
    const match = new Match(
      crypto.randomUUID(),
      data.userId,
      data.matchedUserId,
      new Date(),
    );

    const entity = MatchMapper.toPersistence(match);
    const savedEntity = await this.matchRepo.save(entity);
    return MatchMapper.toDomain(savedEntity);
  }

  async findById(id: string): Promise<Match | null> {
    const entity = await this.matchRepo.findOne({ where: { id } });
    return entity ? MatchMapper.toDomain(entity) : null;
  }

  async findByUserIds(
    userId: string,
    matchedUserId: string,
  ): Promise<Match | null> {
    const entity = await this.matchRepo.findOne({
      where: [
        { user: { id: userId }, matchedUser: { id: matchedUserId } },
        { user: { id: matchedUserId }, matchedUser: { id: userId } },
      ],
    });

    return entity ? MatchMapper.toDomain(entity) : null;
  }

  async findByUserId(userId: string): Promise<Match[]> {
    const entities = await this.matchRepo.find({
      where: [{ user: { id: userId } }, { matchedUser: { id: userId } }],
      relations: ['user', 'matchedUser'],
    });

    return entities.map(MatchMapper.toDomain);
  }

  async remove(id: string): Promise<void> {
    await this.matchRepo.delete(id);
  }
}
