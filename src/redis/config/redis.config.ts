import { registerAs } from '@nestjs/config';
import { IsString, IsNumber } from 'class-validator';
import validateConfig from '../../utils/validate-config';
import { RedisConfig } from './redis.config.type';

class EnvironmentVariablesValidator {
  @IsString()
  REDIS_HOST: string;

  @IsNumber()
  REDIS_PORT: number;

  @IsString()
  REDIS_PASSWORD: string;

  @IsNumber()
  REDIS_TTL: number;

  @IsNumber()
  REDIS_DB: number;
}

export default registerAs<RedisConfig>('redis', () => {
  validateConfig(process.env, EnvironmentVariablesValidator);

  return {
    host: process.env.REDIS_HOST || 'localhost', // Giá trị mặc định
    port: Number(process.env.REDIS_PORT) || 6379, // Giá trị mặc định
    password: process.env.REDIS_PASSWORD || '', // Giá trị mặc định
    ttl: Number(process.env.REDIS_TTL) || 600, // Giá trị mặc định
    db_index: Number(process.env.REDIS_DB) || 0,
  };
});
