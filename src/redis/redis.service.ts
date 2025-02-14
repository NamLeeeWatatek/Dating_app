import { Injectable, Inject } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

@Injectable()
export class RedisService {
  constructor(@Inject(CACHE_MANAGER) private readonly cacheManager: Cache) {}
  async testRedis() {
    await this.cacheManager.set('test_key_123', 'Hello Redis hehe!', 10000);
    const value = await this.cacheManager.get('test_key_123');
    console.log('Redis Value:', value);
  }
  async setValue(key: string, value: any, ttl: number): Promise<void> {
    try {
      console.log(`🔹 Đang lưu key: ${key}, value: ${JSON.stringify(value)}`);
      await this.cacheManager.set(key, value, ttl);
    } catch (error) {
      console.error('❌ Lỗi khi set Redis:', error);
    }
  }
  async getValue(key: string) {
    return await this.cacheManager.get(key);
  }

  async deleteKey(key: string) {
    await this.cacheManager.del(key);
  }
}
