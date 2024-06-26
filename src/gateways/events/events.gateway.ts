import { Server, Socket } from 'socket.io'
import { WebSocketServer,WebSocketGateway,SubscribeMessage,OnGatewayDisconnect,OnGatewayConnection } from '@nestjs/websockets';
import { RabbitmqService } from 'src/services/rabbitmq/rabbitmq/rabbitmq.service';
import { Inject } from '@nestjs/common';

@WebSocketGateway({cors:{origin:'*'}}) export class EventsGateway implements OnGatewayDisconnect{
  @WebSocketServer() server:Server
  
  @SubscribeMessage('leave') async leaveQueue(socket:Socket,consumerTag:string){
    try{
      this.rabbitMq.consumers = this.rabbitMq.consumers.filter(
        c => c.consumerTag !== consumerTag
      )
      await this.rabbitMq.channel.cancel(
        consumerTag
      )     
    }
    catch(err:any){
      console.log(err.message)
    }
  }
   
  @SubscribeMessage('join') async join(socket:Socket,queue:string,cb:(t:string) => void){
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
     
      cb(
        tag
      )
    }
    catch(e:any){
      console.log(e.message)
    }
  }

  handleDisconnect(socket:Socket){
    this.rabbitMq.stopConsume(
      socket.id
    )
  }
 
  constructor(private rabbitMq:RabbitmqService){
    // adding rabbitmq service
  }
}
