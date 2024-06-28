import { Connection,Channel,connect } from 'amqplib'
import { Injectable, OnModuleInit } from '@nestjs/common';

@Injectable() export class RabbitmqService implements OnModuleInit {
  channel:Channel
  connection:Connection
  channels:{[id:string]:Channel[]}
  

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
        await this.channel?.assertQueue(
          queueName, 
          {
            durable:true,
            arguments: {
              'x-queue-type': 'quorum'
            }
          },
          
        )
        await this.channel?.bindQueue(
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