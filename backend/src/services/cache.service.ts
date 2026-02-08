import { RedisClientType } from 'redis';

export class CacheService {
  constructor(private readonly redis: RedisClientType) {}

  async getOrSet<T>(key: string, fetchFn: () => Promise<T>, ttl: number = 3600): Promise<T> {
    const cachedValue = await this.redis.get(key);

    if (cachedValue) {
      console.log(`Cache Hit: ${key}`);
      return JSON.parse(cachedValue) as T;
    }

    console.log(`Cache Miss: ${key}`);
    const freshData = await fetchFn();
    
    if (freshData) {
      await this.redis.set(key, JSON.stringify(freshData), {EX: ttl});
    }

    return freshData;
  }
  
  async invalidate(key: string): Promise<void> {
    const keys = await this.redis.keys(key); 
    if (keys.length > 0) {
        for (const key of keys) {
            await this.redis.del(key);
        }
    }
  }
}