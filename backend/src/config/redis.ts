import {createClient, RedisClientType} from 'redis'

export const redisClient : RedisClientType  = createClient();   // domyslnie sam użyje localhost

redisClient.on('error', (err) => {
  console.error('Redis error:', err);
});

// EXPRESS Z AUTOMATU ZAPEWNIA SINGLETON
// Pierwszy import stowrzy klienta, a kazdy kolejny import odwoła sie do stworzonej już referencji