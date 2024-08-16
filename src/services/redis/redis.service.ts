import { Redis } from 'ioredis';
import { Injectable,Inject, OnModuleInit } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

@Injectable() export class RedisService {
  constructor(@Inject('REDIS_SERVICE') private readonly redis:Redis) {}

  publish(message:string):boolean{
    return this.redis.emit(
      'message',
      message
    )
  }

  fetchList(key:string):Promise<string[]>{
    return (this.redis as any).lRange(
      key,
      0,
      -1
    )
  }

  push(key:string,value:string):Promise<number>{
    return (this.redis as any).lPush(
      key,
      value
    )
  }

  makeEmpty(key):Promise<"OK">{
    return (this.redis as any).lTtrim(key,1,0)
  }
}
