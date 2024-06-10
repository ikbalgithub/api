import { Types } from 'mongoose'
import { Channel } from 'amqplib'
import { Server, Socket } from 'socket.io'
import { WebSocketServer,WebSocketGateway,OnGatewayConnection,SubscribeMessage } from '@nestjs/websockets';
import { Injectable,NestMiddleware,Logger } from '@nestjs/common';
import { RabbitmqService } from 'src/services/rabbitmq/rabbitmq/rabbitmq.service';

@WebSocketGateway({cors:{origin:'*'}}) export class EventsGateway{
  constructor(private rabbitMq:RabbitmqService){
    // adding rabbitmq service
  }

  @WebSocketServer() server:Server

  @SubscribeMessage('consume') consume(_socket,_id:string){
    this.rabbitMq.createQueue(_id)

    this.rabbitMq.consume(`queue_${_id}`,message => {
      var content = message.content
      var buffer = Buffer.from(content)
      console.log(buffer.toString())
    })
  }

  @SubscribeMessage('join') join(socket:Socket,roomId:string){
    socket.join(roomId)
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

  updated(dst:string[],groupId:string){
    this.server.to(dst[0]).emit(
      'updated',groupId
    )

    this.server.to(dst[1]).emit(
      'history/updated',groupId
    )
  }

 
}

interface Room{
  socketId:string,
  userId:string,
  roomId:string,
}