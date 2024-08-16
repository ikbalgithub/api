import { Server,Socket } from 'socket.io'
import { WebSocketServer,WebSocketGateway, SubscribeMessage } from '@nestjs/websockets';
import { RedisService } from 'src/services/redis/redis.service';

@WebSocketGateway({cors:{origin:'*'}}) export class EventsGateway{
  @WebSocketServer() server:Server

  @SubscribeMessage('join') async join(client:Socket,room:string){
    client.join(room)
    
    try{
      var data = await this.redis.fetchList(room)
      
      await this.redis.makeEmpty(room)
      
      data.forEach(x => {
        var [e,dst,v] = x.split('~')
        this.server.to(dst).emit(e,v)
      })
    }
    catch(e:any){
      console.log(e.message)
    }
  }
  
  emit(eventName:string,dst:string,value:any){
    var e = `${eventName}~${dst}~${value}`

    var acknowledge = false
    
    this.server.to(dst).emit(
      eventName,value,next => {
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
