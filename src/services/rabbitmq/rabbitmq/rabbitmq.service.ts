import { Connection,Channel,connect } from 'amqplib'
import { Injectable, OnModuleInit } from '@nestjs/common';

@Injectable() export class RabbitmqService implements OnModuleInit {
  channel:Channel
  connection:Connection
  consumers:Map<string,string[]> = new Map()

  async onModuleInit(){
    try{
      this.connection = await connect(process.env.RABBITMQ_URL)
      this.channel = await this.connection.createChannel()
    }
    catch(e:any){
      console.log(e.message)
    }
  }


  async assertQueue(queueName:string):Promise<void>{
    return new Promise(async (resolve,reject) => {
      try{
        await this.channel.assertQueue(
          queueName, 
          {
            durable:true,
            arguments: {
              'x-queue-type': 'quorum'
            }
          },
          
        )
        await this.channel.bindQueue(
          queueName,
          'socket',
          queueName
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

  consume(queue:string,cb:(m:{content:Buffer}) => void):Promise<string>{
    return new Promise(async (resolve,reject) => {
      try{
        var result = await this.channel.consume(
          'queue',cb,{noAck:false}
        )

        resolve(
          result.consumerTag
        )
      }
      catch(e:any){
        reject(e.message)
      }
    })
  }

  send(routingKey:string,message:string){
    this.channel?.publish(
      'socket',
      routingKey,
      Buffer.from(message),
      {persistent:true}
    )
  }

  ack(message:{content:Buffer}){
    this.channel?.ack(
      message
    )
  }
}