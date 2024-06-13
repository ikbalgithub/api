import { Connection,Channel,connect } from 'amqplib'
import { Injectable, OnModuleInit } from '@nestjs/common';

@Injectable() export class RabbitmqService implements OnModuleInit {
  
  connection:Connection
  channel:Channel

  consumers:{socketId:string,tag:string}[] = []

  async onModuleInit(){
    try{
      this.connection = await connect(process.env.RABBITMQ_URL)
      this.channel = await this.connection.createChannel()
    }
    catch(e:any){
      console.log(e.message)
    }
  }

  consume(queue:string,socketId,onMessage:(message:{content:Buffer}) => void):Promise<string>{
    return new Promise(async (resolve,reject) => {
      try{
        var result = await (this.channel as Channel).consume(
          queue,onMessage,{noAck:false}
        )

        this.consumers.push({
          socketId,
          tag:result.consumerTag
        })

        resolve(
          result.consumerTag
        )
      }
      catch(e:any){
        reject(e)
      }
    })
  }

  async createQueue(queue:string):Promise<void>{
    return new Promise(async (resolve,reject) => {
      try{
        await (this.channel as Channel).assertQueue(
          queue,{durable:true}
        )
        await (this.channel as Channel).bindQueue(
          queue,'socket',queue
        )
        resolve(
          null
        )
      }
      catch(e:any){
        reject(e)
      }
    })
  }

  stopConsume(socketId:string):Promise<void>{
    return new Promise(async (resolve,reject) => {
      var [consumer] = this.consumers.filter(
        c => c.socketId === socketId
      )

      try{
        await this.channel?.cancel(
          consumer.tag
        )
        resolve(null)
      }
      catch(e:any){
        reject(e)
      }
    })
  }

  send(routingKey:string,message:string){
    (this.channel as Channel).publish(
      'socket',
      routingKey,
      Buffer.from(message),
      {persistent:true}
    )
  }

  catch(e:any){
    console.log(e.message)
  }
}
