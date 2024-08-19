import { Server,Socket } from 'socket.io'
import { WebSocketServer,WebSocketGateway, SubscribeMessage, OnGatewayDisconnect } from '@nestjs/websockets';
import { RedisService } from 'src/services/redis/redis.service';
import { userSchema } from 'src/schemas/user.schema';

@WebSocketGateway({cors:{origin:'*'}}) export class EventsGateway implements OnGatewayDisconnect{
  @WebSocketServer() server:Server

  @SubscribeMessage('join') async join(client:Socket,_id:string,rooms:string[]){
    try{
      await client.join([...rooms])
      var users = await this.redis.fetch<User>('users',false)
      if(users.filter(user => user._id === _id).length > 0){
        users = users.filter(user => user._id !== _id)
        users = [...users,{_id,id:client.id,active:true}]
      }
      else{
        users = [...users,{_id,id:client.id,active:true}]
      }

      var events = await this.redis.fetch<Event>('events')

      events.forEach(async e => {
        if(rooms.includes(e.room)){
          var newEvents = events.filter(
            ev => ev.room !== e.room
          )
          
          e.events.forEach(({event,value}) => {
            this.server.to(e.room).emit(
              event,value
            )
          })
         
          try{
            await this.redis.set(
              'events',
              newEvents
            )
          }
          catch(e:any){
            console.log(e.message)
          }
        }
      })

      await this.redis.set(
        'users',users
      )
    }
    catch(e:any){
      console.log(e.message)
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
        var events = await this.redis.fetch<Event>('events')
        var [filter] = events.filter(e => e.room === dst)

        if(filter){
          events = events.filter(e => e.room === filter.room)
          var newEvents = [...filter.events,{event,value}]
          var filter = {...filter,events:newEvents}
          var events = [...events,filter]

          await this.redis.set(
            'events',
            events
          )
        }
        else{
          await this.redis.push(
            'events',[{room:dst,events:[{event,value}]}]
          )
        }
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