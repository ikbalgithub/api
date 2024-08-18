import { Server,Socket } from 'socket.io'
import { WebSocketServer,WebSocketGateway, SubscribeMessage, OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { RedisService } from 'src/services/redis/redis.service';

@WebSocketGateway({cors:{origin:'*'}}) export class EventsGateway implements OnGatewayDisconnect{
  @WebSocketServer() server:Server

  @SubscribeMessage('join') async join(client:Socket,room:string){
    try{
      var id = client.id
      await client.join(room)
      await this.redis.push('rooms',{id,room})
    }
    catch(e:any){
      console.log(e.message)
    }
  }
  
  async emit(event:string,destination:string,value:any):Promise<void>{
    
    try{
      var rooms = await this.redis.fetch<Room>('rooms',false)
      var [online] = rooms.filter(({room}) => {
        return room === destination
      })

      if(online){
        this.server.to(destination).emit(
          event,value
        )
      }
      else{
        var cache = {event,value}
        await this.redis.push(
          destination,cache
        )
      }
    }
    catch(e:any){
      console.log(e.message)
    }
  }


  async handleDisconnect(client:Socket){
    try{
      var rooms = await this.redis.fetch<Room>(
        'rooms',false
      )

      var rooms = rooms.filter(x => {
        return x.id !== client.id
      })

      await this.redis.set(
        'rooms',
        rooms
      )
    }
    catch(e:any){
      console.log(e.message)
    }
  }
  constructor(private redis:RedisService){
    // using redis ervice
  }
}

interface Room{
  id:string,
  room:string
}