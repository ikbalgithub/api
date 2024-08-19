import { Server,Socket } from 'socket.io'
import { WebSocketServer,WebSocketGateway, SubscribeMessage, OnGatewayDisconnect } from '@nestjs/websockets';
import { RedisService } from 'src/services/redis/redis.service';
import { userSchema } from 'src/schemas/user.schema';

@WebSocketGateway({cors:{origin:'*'}}) export class EventsGateway implements OnGatewayDisconnect{
  @WebSocketServer() server:Server

  @SubscribeMessage('join') async join(client:Socket,params:{_id:string,paths:string[]}){
    try{
      await client.join([...params.paths])
      var users = await this.redis.fetch<User>('users',false)
      if(users.filter(user => user._id === params._id).length > 0){
        users = users.filter(user => user._id !== params._id)
        users = [...users,{_id:params._id,id:client.id,active:true}]
      }
      else{
        users = [...users,{_id:params._id,id:client.id,active:true}]
      }

      params.paths.forEach(async path => {
        try{
          var events = await this.redis.fetch<any>(path,true)
          events.forEach(event => {
            this.server.to(path).emit(
              event.event,
              event.value
            )
          })
        }
        catch(e:any){
          console.log(e.message)
        }
      })
      
      await this.redis.set(
        'users',users
      )
    }
    catch(e:any){
      console.log(e)
    }
  }
  
  async emit(event:string,dst:string,value:any,_id:string):Promise<void>{
    try{
      var users = await this.redis.fetch<User>('users',false)
      var [user] = users.filter(u => u._id === _id)

      if(user && user.active) this.server.to(dst).emit(
        event,value
      )
      else{
        this.redis.push(
          dst,[{event,value}]
        )
      }
    }
    catch(e:any){
      console.log(e.message)
    }
  }

  async handleDisconnect(client:Socket){
    try{
      var users = await this.redis.fetch<User>('users',false)
      var [user] = users.filter(user => user.id === client.id)
      
      if(user){
        users = users.filter(u => u._id !== user._id)
        users = [...users,{...user,active:false}]
        await this.redis.set(
          'users',users
        )
      }
    }
    catch(e:any){
      console.log(e.message)
    }
  }

  constructor(private redis:RedisService){
    // using redis ervice
  }
}



interface Event{
  room:string,
  events:{event:string,value:any}[]
}


interface User{
  _id:string,
  id:string,
  active:boolean
}