import { Connection,Channel,connect } from 'amqplib'
import { Injectable, OnModuleInit } from '@nestjs/common';

@Injectable() export class RabbitmqService implements OnModuleInit {
  
  connection:Connection
  channel:Channel

  consumers: {socketId:string,consumerTag:string}[] = []

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
          consumerTag:result.consumerTag
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

  stopConsume(socketId:string){
    var queues = this.consumers.filter(
      q => q.socketId === socketId
    )

    queues.forEach(async ({consumerTag},index) => {
      try{
        await this.channel?.cancel(
          consumerTag
        )

        this.consumers.splice(index,1)
      }
      catch(e:any){
        console.log
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
