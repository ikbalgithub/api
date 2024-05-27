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

  newMessage<Type>(message:Type,dst:string[]){
    // for home/messages/detail page (works)
    this.server.to(dst[0]).emit(
      'history/newMessage',
      message
    )


    // for detail page (works)
    this.server.to(dst[1]).emit(
      'incomingMessage',
      message
    )
  }

  message<Type>(newMessage:Type,dst:string[]){
    setTimeout(() => {
      this.server.to(dst[0]).emit(
        'history/message',
        newMessage
      )
    },3000)

    // for home/messages/detail page (works)
  }

  updated(to:string){
    this.server.to(to).emit('updated')
  }
}

