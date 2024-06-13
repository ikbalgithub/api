import { Types } from 'mongoose'
import { Channel } from 'amqplib'
import { Server, Socket } from 'socket.io'
import { WebSocketServer,WebSocketGateway,SubscribeMessage,OnGatewayDisconnect } from '@nestjs/websockets';
import { Injectable,NestMiddleware,Logger } from '@nestjs/common';
import { RabbitmqService } from 'src/services/rabbitmq/rabbitmq/rabbitmq.service';

@WebSocketGateway({cors:{origin:'*'}}) export class EventsGateway implements OnGatewayDisconnect{
  @WebSocketServer() server:Server

 
  @SubscribeMessage('join') async join(socket:Socket,roomId:string){
    socket.join(roomId)

    try{
      var queue = await this.rabbitMq.createQueue(roomId)
      var cT = await this.rabbitMq.consume(roomId,socket.id,m => {
        this.rabbitMq.channel.ack(m)
        var content = m.content
        var eventInfo = content.toString()
        var [event,dst,data] = eventInfo.split('~')        
        this.server.to(dst).emit(event,JSON.parse(data))
      })
    }
    catch(e:any){
      console.log(e.message)
    }
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
      'history/updated',
      groupId
    )
  }

  async handleDisconnect(socket: Socket) {
    this.rabbitMq.stopConsume(socket.id)
  }
 
  constructor(private rabbitMq:RabbitmqService){
    // adding rabbitmq service
  }
}
