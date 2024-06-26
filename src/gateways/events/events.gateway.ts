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
      var tag = await this.rabbitMq.consume(socket.id,queue,m => {
        var content = m.content
        var eventInfo = content.toString()
        var [event,dst,data] = eventInfo.split('~')
        var objectData = JSON.parse(data)
        this.server.to(dst).emit(
          event,
          objectData,
          r => this.rabbitMq.ack(
            m
          )
        )
      });
    }
    catch(e:any){
      console.log(e.message)
    }
  }

  handleDisconnect(socket:Socket){
    this.rabbitMq.onDisconnect()
    this.server.emit('forceClose')
  }
 
  constructor(private rabbitMq:RabbitmqService){
    // adding rabbitmq service
  }
}
