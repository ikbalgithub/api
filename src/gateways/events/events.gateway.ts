import { Server, Socket } from 'socket.io'
import { WebSocketServer,WebSocketGateway,SubscribeMessage,OnGatewayDisconnect,OnGatewayConnection } from '@nestjs/websockets';
import { RabbitmqService } from 'src/services/rabbitmq/rabbitmq/rabbitmq.service';

@WebSocketGateway({cors:{origin:'*'}}) export class EventsGateway implements OnGatewayDisconnect{
  @WebSocketServer() server:Server
  
   
  @SubscribeMessage('join') async joinAndConsume(socket:Socket,queue:string){
    try{
      await socket.join(queue)
      await this.rabbitMq.assertQueue(queue)
      
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
      },{noAck:false})

      if(this.rabbitMq.channels[socket.id]){
        this.rabbitMq.channels[socket.id] = [
          ...this.rabbitMq.channels[socket.id],
          channel
        ]
      }
      else{
        this.rabbitMq.channels[socket.id] = [channel]
      }
    }
    catch(e:any){
      console.log(e.message)
    }
  }

  async handleDisconnect(socket:Socket){
    var channels = [...this.rabbitMq.channels[socket.id]]

    delete this.rabbitMq.channels[socket.id]

    channels.forEach(async channel => {
      try{
        await channel?.close()
      }
      catch(e:any){
        console.log(e.message)
      }
    })

  }
 
  constructor(private rabbitMq:RabbitmqService){
    // adding rabbitmq service
  }
}
