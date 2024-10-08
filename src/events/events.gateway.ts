import { Server,Socket } from 'socket.io'
import { RedisService } from 'src/redis/redis.service';
import { SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';

const origin = 'https://4200-idx-messenger-1726458761014.cluster-mwrgkbggpvbq6tvtviraw2knqg.cloudworkstations.dev'

@WebSocketGateway({cors:{origin}}) export class EventsGateway {  
  @WebSocketServer() server:Server

  @SubscribeMessage('join') async join(client:Socket,params:{paths:string[]}):Promise<void>{
    try{
      await client.join([...params.paths])
      params.paths.forEach(async path => {
        try{
          await this.onJoined(
            path,true
          )
        }
        catch(e:any){
          console.log(e.message)
        }
      })
    }
    catch(e:any){
      console.log(e)
    }
  }

  @SubscribeMessage('ack') async ack(path:string):Promise<void>{
    try{
      await this.redis.fetch<any>(path,true)
    }
    catch(e:any){
      console.log(e.message)
    }
  }

  async emit(event:string,dst:string,value:any){
    try{
      await this.redis.push(
        dst,
        [{event,value}]
      )
      this.server.to(dst).emit(
        event,value
      )
      this.server.to(dst).emit(
        'ack',dst
      )
    }
    catch(e:any){
      console.log(e.message)
    }
  }

  async onJoined(path:string,remove:boolean):Promise<void>{
    try{
      var events = await this.redis.fetch<Event>(
        path,true
      )

      events.forEach(({event,value}) => {
        this.server.to(path).emit(
          event,value
        )
      })
    }
    catch(e:any){
      console.log(e.message)
    }
  }
  
  constructor(private redis:RedisService){
    // inject redis service
  }
}

interface Event{
  event:string,
  value:any
}
