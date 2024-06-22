import { Server, Socket } from 'socket.io'
import { WebSocketServer,WebSocketGateway,SubscribeMessage,OnGatewayDisconnect } from '@nestjs/websockets';
import { RabbitmqService } from 'src/services/rabbitmq/rabbitmq/rabbitmq.service';

@WebSocketGateway({cors:{origin:'*'}}) export class EventsGateway implements OnGatewayDisconnect{
  @WebSocketServer() server:Server

 
  @SubscribeMessage('join') async join(socket:Socket,roomId:string){
    socket.join(roomId)

    try{
      await this.rabbitMq.createQueue(roomId)
      await this.rabbitMq.consume(roomId,socket.id,m => {
        this.rabbitMq.channel.ack(m)
        var content = m.content
        var eventInfo = content.toString()
        var [event,dst,data] = eventInfo.split('~')
        var objectData = JSON.parse(data)
        this.server.to(dst).emit(event,objectData)
      })
    }
    catch(e:any){
      console.log(e.message)
    }
  }

  @SubscribeMessage('leave') leave(socket:Socket,prevId:string){
    this.rabbitMq.stopConsume(prevId)
  }

  handleDisconnect(socket:Socket) {
    this.rabbitMq.stopConsume(socket.id)
  }
 
  constructor(private rabbitMq:RabbitmqService){
    // adding rabbitmq service
  }
}
