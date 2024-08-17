import { Server,Socket } from 'socket.io'
import { WebSocketServer,WebSocketGateway, SubscribeMessage } from '@nestjs/websockets';
import { RedisService } from 'src/services/redis/redis.service';

@WebSocketGateway({cors:{origin:'*'}}) export class EventsGateway{
  @WebSocketServer() server:Server

  @SubscribeMessage('join') async join(client:Socket,room:string){
    try{
      await client.join(room)
      var data = await this.redis.fetch(room)
      data.forEach(x => {
        var [e,dst,v] = x.split('~')
        var objValue = JSON.parse(v)
        this.server.to(dst).emit(
          e,objValue
        )
      })
    }
    catch(e:any){
      console.log(e.message)
    }
    
    // try{
    //   var data = await this.redis.fetchList(room)
    //   console.log({data})
      
    //   await this.redis.makeEmpty(room)
      
    //   data.forEach(x => {
    //     var [e,dst,v] = x.split('~')
    //     var objValue = JSON.parse(v)
    //     this.server.to(dst).emit(
    //       e,objValue
    //     )
    //   })
    // }
    // catch(e:any){
    //   console.log(e.message)
    // }
  }
  
  emit(eventName:string,dst:string,value:string){
    console.log(JSON.parse(value))
    // var e = `${eventName}~${dst}~${value}`
    // var objValue = JSON.parse(value)

    // var acknowledge = false
    
    // this.server.to(dst).emit(
    //   eventName,objValue,next => {
    //     acknowledge = true
    //   }
    // )
    
    // setTimeout(() => {
    //   if(!acknowledge){
    //     this.redis.push(dst,e)
    //   }
    // },3000)
  }

  constructor(private redis:RedisService){
    // using redis ervice
  }
}
