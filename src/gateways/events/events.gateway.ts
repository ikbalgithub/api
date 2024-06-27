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

      this.rabbitMq.channels = [
        ...this.rabbitMq.channels,
        {id:socket.id,channel}
      ]

    }
    catch(e:any){
      console.log(e.message)
    }
  }

  handleDisconnect(socket:Socket){
    var channels = this.rabbitMq.channels.filter(
      c => c.id === socket.id
    )

    this.rabbitMq.channel = this.rabbitMq.channels.filter(
      c => c.id !== socket.id
    )

    channels.forEach(c => {
      c.channel?.close()
    })
  }
 
  constructor(private rabbitMq:RabbitmqService){
    // adding rabbitmq service
  }
}
