import { CacheModule } from '@nestjs/cache-manager';
import { Global, Module } from '@nestjs/common';
import { RedisService } from './redis.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { redisStore } from 'cache-manager-redis-yet';
import { AllConfigType } from '../config/config.type';

@Global()
@Module({
  imports: [
    CacheModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService<AllConfigType>) => ({
        store: redisStore({
          socket: {
            host: configService.get('redis.host', { infer: true }),
            port: configService.get('redis.port', { infer: true }),
          },
        }),
        host: configService.get('redis.host', { infer: true }),
        port: configService.get('redis.port', { infer: true }),
        ttl: configService.get('redis.ttl', { infer: true }),
        db_index: configService.get('redis.db_index', { infer: true }),
      }),
    }),
  ],
  providers: [RedisService],
  exports: [RedisService, CacheModule],
})
export class RedisModule {}
