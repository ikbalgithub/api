import { Types } from 'mongoose'
import { Channel } from 'amqplib'
import { Server, Socket } from 'socket.io'
import { WebSocketServer,WebSocketGateway,SubscribeMessage,OnGatewayDisconnect } from '@nestjs/websockets';
import { Injectable,NestMiddleware,Logger } from '@nestjs/common';
import { RabbitmqService } from 'src/services/rabbitmq/rabbitmq/rabbitmq.service';

@WebSocketGateway({cors:{origin:'*'}}) export class EventsGateway implements OnGatewayDisconnect{
  constructor(private rabbitMq:RabbitmqService){
    // adding rabbitmq service
  }

  @WebSocketServer() server:Server

  @SubscribeMessage('consume') consume(socket:Socket,_id:string){
    this.rabbitMq.createQueue(_id)

    this.rabbitMq.consume(_id,socket.id,message => {
      this.rabbitMq.channel.ack(message)
      var content = message.content
      var buffer = Buffer.from(content)
      var toString = buffer.toString()
      var [event,dst,data] = toString.split('~')
      
      console.log(`sending event ${event} info to ${dst}`)
      
      this.server.to(dst).emit(event,JSON.parse(data))
    })
  }

  @SubscribeMessage('join') join(socket:Socket,roomId:string){
    socket.join(roomId)
  }

  newMessage<Type>(message:Type,dst:string[]){
    // for messages/detail page (works)
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

    // for messages/detail page (works)
  }

  updated(dst:string[],groupId:string){
    this.server.to(dst[0]).emit(
      'updated',groupId
    )

    this.server.to(dst[1]).emit(
      'history/updated',groupId
    )
  }

  handleDisconnect(socket: Socket) {
    this.rabbitMq.stopConsume(
      socket.id
    )
  }
 
}
