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
        console.log(message)
      })
      
      if(this.rabbitMq.channels.has(socket.id)){
        var prev = this.rabbitMq.channels.get(
          socket.id
        )
        
        this.rabbitMq.channels.set(
          socket.id,[
            ...prev,
            channel
          ]
        )
      }
      else{
        this.rabbitMq.channels.set(
          socket.id,[channel]
        )
      }
     
      // var consumer = await channel?.consume(queue,message => {
      //   var content = message.content
      //   var eventInfo = content.toString()
      //   var [event,dst,data] = eventInfo.split('~')
      //   var objectData = JSON.parse(data)

      //   this.rabbitMq.ack(message)
      //   this.server.to(dst).emit(
      //     event,
      //     objectData,
      //   )
      // },{noAck:false})
    }
    catch(e:any){
      console.log(e.message)
    }
  }

  handleDisconnect(socket:Socket){
    this.rabbitMq.channels.get(socket.id).forEach(
      channel => channel.close()
    )
  }
 
  constructor(private rabbitMq:RabbitmqService){
    // adding rabbitmq service
  }
}
