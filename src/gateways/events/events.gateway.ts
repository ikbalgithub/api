import { Server, Socket } from 'socket.io'
import { WebSocketServer,WebSocketGateway,SubscribeMessage,OnGatewayDisconnect,OnGatewayConnection } from '@nestjs/websockets';
import { RabbitmqService } from 'src/services/rabbitmq/rabbitmq/rabbitmq.service';
import { Inject } from '@nestjs/common';

@WebSocketGateway({cors:{origin:'*'}}) export class EventsGateway implements OnGatewayDisconnect{
  @WebSocketServer() server:Server
  
  @SubscribeMessage('leave') leaveQueue(socket:Socket,consumerTag:string){
    this.rabbitMq.channel.cancel(
      consumerTag
    )
  }
   
  @SubscribeMessage('join') async join(socket:Socket,roomId:string,cb:Function){
    socket.join(roomId)

    try{
      await this.rabbitMq.createQueue(roomId)
      var tag = await this.rabbitMq.consume(socket.id,roomId,m => {
        var content = m.content
        var eventInfo = content.toString()
        var [event,dst,data] = eventInfo.split('~')
        var objectData = JSON.parse(data)
        this.server.to(dst).emit(
          event,
          objectData,
          () => {
            console.log('acknowledge message')
            this.rabbitMq.channel.ack(m)
          }
        )
      })

      cb(tag)
    }
    catch(e:any){
      console.log(e.message)
    }
  }

  handleDisconnect(socket:Socket){
    this.rabbitMq.stopConsume(
      socket.id,0
    )
  }
 
  constructor(private rabbitMq:RabbitmqService){
    // adding rabbitmq service
  }
}
