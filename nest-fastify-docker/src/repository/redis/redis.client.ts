import Redis from 'ioredis';
import { Injectable } from '@nestjs/common';

@Injectable()
export class RedisClient {
  constructor(private readonly redis = new Redis()) {}

  public async set(
    key: string,
    value: string | Buffer | number,
  ): Promise<void> {
    await this.redis.set(key, value);
  }

  public async delete(key: string): Promise<number> {
    return this.redis.del(key);
  }

  public async get(key: string): Promise<string | null> {
    return this.redis.get(key);
  }

  public async getSet(
    key: string,
    value: string | Buffer | number,
  ): Promise<string> {
    return this.redis.getset(key, value);
  }

  public async multiGet(...keys: string[]): Promise<string[]> {
    return this.redis.mget(keys);
  }

  public async flushAll(): Promise<void> {
    await this.redis.flushall();
  }

  public async quit(): Promise<void> {
    await this.redis.quit();
  }
}
