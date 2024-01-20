import { Types } from 'mongoose'
import { Server, Socket } from 'socket.io'
import { WebSocketServer,WebSocketGateway,OnGatewayConnection } from '@nestjs/websockets';

@WebSocketGateway({ 
  cors:{
    origin:'*'
  }
})

export class EventsGateway implements OnGatewayConnection{
  @WebSocketServer() server:Server

  newMessage<Type>(message:Type){
    this.server.emit(
      'newMessage',
      message
    )
  }

  message<Type>(newMessage:Type){
    setTimeout(() => {
      this.server.emit(
        'message',
        newMessage
      )
    },3000)
  }

  updated(_id:Types.ObjectId){
    this.server.emit(
      'updated',
      _id
    )
  }
  
  handleConnection(){
    console.log('connected')
  }
}

