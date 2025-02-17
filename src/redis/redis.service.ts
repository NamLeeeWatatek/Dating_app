import { Injectable, Inject } from '@nestjs/common';
import Redis from 'ioredis';

@Injectable()
export class RedisService {
  constructor(@Inject('REDIS_CLIENT') private readonly redis: Redis) {}

  private formatKey(folder: string, key: string): string {
    return `${folder}/${key}`;
  }

  async set(folder: string, key: string, value: any, ttl?: number) {
    const fullKey = this.formatKey(folder, key);
    const data = JSON.stringify(value);
    if (ttl) {
      await this.redis.set(fullKey, data, 'EX', ttl);
    } else {
      await this.redis.set(fullKey, data);
    }
  }

  async get<T>(folder: string, key: string): Promise<T | null> {
    const fullKey = this.formatKey(folder, key);
    const data = await this.redis.get(fullKey);
    console.log(`🔍 [Redis] Get: ${fullKey} ->`, data);
    return data ? JSON.parse(data) : null;
  }

  async del(folder: string, key: string) {
    const fullKey = this.formatKey(folder, key);
    await this.redis.del(fullKey);
  }

  async getKeysByFolder(folder: string): Promise<string[]> {
    const keys = await this.redis.keys(`${folder}/*`);
    return keys;
  }
}
