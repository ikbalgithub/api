import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Injectable,Inject, OnModuleInit } from '@nestjs/common';
import { Cache } from 'cache-manager';
import { ClientProxy } from '@nestjs/microservices';
import { Observable } from 'rxjs';

@Injectable() export class RedisService implements OnModuleInit{
  constructor(
    @Inject('REDIS_SERVICE') private redisPubsub:ClientProxy,
    @Inject(CACHE_MANAGER) private redisCache:Cache
  ){}

  async push(key:string,value:string):Promise<void>{
    try{
      var list = await this.redisCache.get<string[]>(key)

      if(list){
        var newList = [...list,value]
        await this.redisCache.set(key,newList)
      }
      else{
        await this.redisCache.set(
          key,[value]
        )
      }
    }
    catch(e:any){
      console.log(e.message)
    }
  }

  async fetch(key){
    try{
      var data = await this.redisCache.get<string[]>(key)

      if(data) await this.redisCache.set(key,[])

      return data ? data : []
    }
    catch(e:any){
      console.log(e.message)
    }
  }

  publish(message:string){
    console.log(
      {message}
    )
  }

  async onModuleInit() {
    
  }
}
