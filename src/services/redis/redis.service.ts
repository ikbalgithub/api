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

  async push(key:string,value:any):Promise<void>{
    try{
      var list = await this.redisCache.get<any[]>(key)

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

  /**
   * fetch a list in redis
   * @param {string} key - list key.
   * @param {boolean} remove - if you want to clear the list.
   * @returns {Array<any>} - returm list or an empty array
   */

  async fetch<T>(key:string,remove:boolean):Promise<T[]>{
    try{
      var data = await this.redisCache.get<T[]>(key)

      if(data && remove) await this.redisCache.set(
        key,[]
      )

      return data ? data : []
    }
    catch(e:any){
      console.log(e.message)
    }
  }

  publish(message:string){
    this.redisPubsub.emit(
      'message',message
    )
  }

  async set(key:string,value:any){
    try{
      await this.redisCache.set(
        key,value
      )
    }
    catch(e:any){
      console.log(e.message)
    }
  }

  async inspect(key:string):Promise<boolean>{
    try{
      var data =await this.redisCache.get(
        key
      )
      return data ? true : false
    }
    catch(e:any){
      console.log(e.message)
    }
  }



  async onModuleInit() {
    
  }
}
