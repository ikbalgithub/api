import { Server,Socket } from 'socket.io'
import { WebSocketServer,WebSocketGateway, SubscribeMessage, OnGatewayDisconnect } from '@nestjs/websockets';
import { RedisService } from 'src/services/redis/redis.service';
import { userSchema } from 'src/schemas/user.schema';
import path from 'path';

@WebSocketGateway({cors:{origin:'*'}}) export class EventsGateway implements OnGatewayDisconnect{
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

  async emit(event:string,dst:string,value:any){
    var callback = async () => {
      console.log('ok')
    }
    
    try{
      await this.redis.push(
        dst,
        [{event,value}]
      )
      this.server.to(dst).emit(
        event,value,callback.bind(this)
      )
    }
    catch(e:any){
      console.log(e.messagse)
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

  async handleDisconnect(client:Socket){
    // handle disconnect
  }

  constructor(private redis:RedisService){
    // using redis ervice
  }
}

interface Event{
  event:string,
  value:any
}
