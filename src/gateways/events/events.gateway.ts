import { Server, Socket } from 'socket.io'
import { WebSocketServer,WebSocketGateway,SubscribeMessage,OnGatewayDisconnect,OnGatewayConnection } from '@nestjs/websockets';
import { RabbitmqService } from 'src/services/rabbitmq/rabbitmq/rabbitmq.service';

@WebSocketGateway({cors:{origin:'*'}}) export class EventsGateway implements OnGatewayDisconnect{
  @WebSocketServer() server:Server
  
   
  @SubscribeMessage('join') async joinAndConsume(socket:Socket,queue:string){
    try{
      await socket.join(queue)
      await this.rabbitMq.assertQueue(queue)
      var consumerTag = await this.rabbitMq.consume(queue,message => {
        var content = message.content.toString()
        var [event,_dst,msg] = content.split("~")
        this.rabbitMq.ack(message)
        this.server.to(socket.id).emit(
          event,JSON.parse(msg)
        )
      })
      
      if(this.rabbitMq.consumers.get(socket.id)){
        var prev = this.rabbitMq.consumers.get(
          socket.id
        )
        this.rabbitMq.consumers.set(
          socket.id,
          [...prev,consumerTag]
        )
      }
      else{
        this.rabbitMq.consumers.set(
          socket.id,
          [consumerTag]
        )
      }
    }
    catch(e:any){
      console.log(e.message)
    }
  }

  async handleDisconnect(socket:Socket){
    await this.rabbitMq.consumers.get(socket.id).forEach(
      cT => this.rabbitMq.channel.cancel(cT)
    )

    this.rabbitMq.consumers.delete(
      socket.id
    )
  }
 
  constructor(private rabbitMq:RabbitmqService){
    // adding rabbitmq service
  }
}
