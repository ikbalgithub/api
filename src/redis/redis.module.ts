import { Module } from '@nestjs/common';
import { RedisService } from './redis.service';
import { CacheModule } from '@nestjs/cache-manager';
import { RedisClientOptions } from 'redis';
import * as redisStore from 'cache-manager-redis-store'

const url = 'redis://default:idrQa2casLBSTccK475rLtHtifZlS4me@redis-19926.c8.us-east-1-3.ec2.redns.redis-cloud.com:19926/0'
const cacheModule = CacheModule.register<RedisClientOptions>(
  {
    isGlobal:false,
    store:redisStore,
    url
  }
)

@Module({
  providers: [RedisService],
  exports: [RedisService],
  imports: [cacheModule]
})
export class RedisModule {
  // redis module...
}
