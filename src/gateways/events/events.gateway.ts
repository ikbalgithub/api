import { Server,Socket } from 'socket.io'
import { WebSocketServer,WebSocketGateway, SubscribeMessage, OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { RedisService } from 'src/services/redis/redis.service';

@WebSocketGateway({cors:{origin:'*'}}) export class EventsGateway implements OnGatewayDisconnect{
  @WebSocketServer() server:Server

  @SubscribeMessage('join') join(client:Socket,rooms:string[]){
    rooms.forEach(async room => {
      var id = client.id

      try{
        await client.join(
          room
        )

        await this.redis.push(
          'rooms',{id,room}
        )
      }
      catch(e:any){
        console.log(e.message)
        console.log(e.message)
      }
    })
    

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
  
  async emit(eventName:string,dst:string,value:string){
    var e = `${eventName}~${dst}~${value}`
    var objValue = JSON.parse(value)
    
    try{
      var rooms = await this.redis.fetch<Room>('rooms',false)
      var [online] = rooms.filter(({room}) => room === dst)

      if(online){
        this.server.to(dst).emit(
          eventName,objValue
        )
      }
      else{
        await this.redis.push(
          dst,
          JSON.stringify(e)
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