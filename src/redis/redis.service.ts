import { Injectable, Inject } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

@Injectable()
export class RedisService {
  constructor(@Inject(CACHE_MANAGER) private readonly cacheManager: Cache) {}

  async setValue(key: string, value: any, ttl = 3600) {
    await this.cacheManager.set(key, value, ttl);
    console.log('load inside service');
  }

  async getValue(key: string) {
    return await this.cacheManager.get(key);
  }

  async deleteKey(key: string) {
    await this.cacheManager.del(key);
  }
}
