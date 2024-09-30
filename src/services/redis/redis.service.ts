import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Injectable,Inject, OnModuleInit } from '@nestjs/common';
import { Cache } from 'cache-manager';

@Injectable() export class RedisService implements OnModuleInit{
  //constructor(@Inject(CACHE_MANAGER) private redis:Cache){}

  async push(key:string,value:any[]):Promise<void>{
    // try{
    //   var target = await this.redis.get<any[]>(
    //     key
    //   )

    //   if(target){
    //     var updated = [...target,...value]
    //     await this.redis.set(key,updated)
    //   }
    //   else{
    //     await this.redis.set(
    //       key,[...value]
    //     )
    //   }
    // }
    // catch(e:any){
    //   console.log(e.message)
    // }
  }

  async fetch<T>(key:string,remove?:boolean):Promise<T[]|void>{
    // try{
    //   var target = await this.redis.get<T[]>(key)

    //   if(target && remove) await this.redis.set(key,[])

    //   return target ? target : []
    // }
    // catch(e:any){
    //   console.log(e.message)
    // }
  }

  

  async set(key:string,value:any):Promise<void>{
    // try{
    //   await this.redis.set(
    //     key,value
    //   )
    // }
    // catch(e:any){
    //   console.log(e.message)
    // }
  }

  async onModuleInit() {
    
  }
}
