import { Types } from 'mongoose'
import { Server, Socket } from 'socket.io'
import { WebSocketServer,WebSocketGateway,OnGatewayConnection,SubscribeMessage } from '@nestjs/websockets';

@WebSocketGateway({ 
  cors:{
    origin:'*'
  }
})

export class EventsGateway{
  @WebSocketServer() server:Server

  @SubscribeMessage('join') join(socket:Socket,id:string){
    socket.join(id)
  }

  newMessage<Type>(message:Type,dst:string){
    this.server.to(dst).emit(
      'newMessage',
      message
    )
  }

  message<Type>(newMessage:Type,to:string){
    setTimeout(() => {
      this.server.to(to).emit(
        'message',
        newMessage
      )
    },3000)
  }

  updated(){
    this.server.emit('updated')
  }
}

