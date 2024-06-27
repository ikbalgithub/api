import { Server, Socket } from 'socket.io'
import { WebSocketServer,WebSocketGateway,SubscribeMessage,OnGatewayDisconnect,OnGatewayConnection } from '@nestjs/websockets';
import { RabbitmqService } from 'src/services/rabbitmq/rabbitmq/rabbitmq.service';
import { Inject } from '@nestjs/common';

@WebSocketGateway({cors:{origin:'*'}}) export class EventsGateway implements OnGatewayDisconnect{
  @WebSocketServer() server:Server
  
   
  @SubscribeMessage('join') async joinAndConsume(socket:Socket,queue:string){
    try{
      await socket.join(queue)
      await this.rabbitMq.createQueue(queue)
      
      var channel = await this.rabbitMq.connection.createChannel()
      var consumer = await channel?.consume(queue,message => {
        var content = message.content
        var eventInfo = content.toString()
        var [event,dst,data] = eventInfo.split('~')
        var objectData = JSON.parse(data)

        this.rabbitMq.ack(message)
        this.server.to(dst).emit(
          event,
          objectData,
        )
      },{noAck:false});

      var [filter] = this.rabbitMq.consumers.filter(
        c => c.id === socket.id
      )

      if(filter){
        var index = this.rabbitMq.consumers.findIndex(
          c => c.id === socket.id
        )

        this.rabbitMq.consumers[index] = {
          ...filter,
          channels:[
            ...filter.channels,
            channel
          ]
        }
      }
      else{
        this.rabbitMq.consumers = [
          ...this.rabbitMq.consumers,
          {
            id:socket.id,
            channels:[channel]
          }
        ]
      }

    }
    catch(e:any){
      console.log(e.message)
    }
  }

  handleDisconnect(socket:Socket){
    var [f] = this.rabbitMq.consumers.filter(
      c => c.id === socket.id
    )

    if(f){
      f.channels.forEach(async c => {
        try{
          await c?.close()
        }
        catch(e:any){
          console.log(e.message)
        }
      })
    }
  }
 
  constructor(private rabbitMq:RabbitmqService){
    // adding rabbitmq service
  }
}
