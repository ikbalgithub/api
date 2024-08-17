import { Server,Socket } from 'socket.io'
import { WebSocketServer,WebSocketGateway, SubscribeMessage, OnGatewayConnection } from '@nestjs/websockets';
import { RedisService } from 'src/services/redis/redis.service';

@WebSocketGateway({cors:{origin:'*'}}) export class EventsGateway implements OnGatewayConnection{
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
    var e = `${eventName}~${dst}~${value}`
    var objValue = JSON.parse(value)

  }

  constructor(private redis:RedisService){
    // using redis ervice
  }
  handleConnection(client:Socket) {
    this.redis.push('socket',client.id)
  }
}
