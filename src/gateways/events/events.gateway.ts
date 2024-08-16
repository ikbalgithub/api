import { Server,Socket } from 'socket.io'
import { WebSocketServer,WebSocketGateway, SubscribeMessage } from '@nestjs/websockets';
import { RedisService } from 'src/services/redis/redis.service';

@WebSocketGateway({cors:{origin:'*'}}) export class EventsGateway{
  @WebSocketServer() server:Server

  @SubscribeMessage('join') async join(client:Socket,room:string){
    client.join(room)
    
    try{
      var data = await this.redis.fetchList(room)
      console.log({data})
      
      await this.redis.makeEmpty(room)
      
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
  }
  
  emit(eventName:string,dst:string,value:string){
    var e = `${eventName}~${dst}~${value}`
    var objValue = JSON.parse(value)

    var acknowledge = false
    
    this.server.to(dst).emit(
      eventName,objValue,next => {
        acknowledge = true
      }
    )
    
    setTimeout(async() => {
      if(!acknowledge){
        try{
          await this.redis.push(
            dst,
            e
          )
        }
        catch(e:any){
          console.log(e.message)
        }
      }
    },3000)
  }

  constructor(private redis:RedisService){
    // using redis ervice
  }
}
