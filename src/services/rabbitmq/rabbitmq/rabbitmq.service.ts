import { Connection,Channel,connect } from 'amqplib'
import { Injectable, OnModuleInit } from '@nestjs/common';

@Injectable() export class RabbitmqService implements OnModuleInit {
  channel:Channel
  connection:Connection
  consumers:{id:string,channels:Channel[]}[] = []
  

  async onModuleInit(){
    try{
      this.connection = await connect(process.env.RABBITMQ_URL)
      this.channel = await this.connection.createChannel()
    }
    catch(e:any){
      console.log(e.message)
    }
  }


  async createQueue(queue:string):Promise<void>{
    return new Promise(async (resolve,reject) => {
      try{
        await this.channel?.assertQueue(
          queue, 
          {
            durable:true,
            arguments: {
              'x-queue-type': 'quorum'
            }
          },
          
        )
        await this.channel?.bindQueue(
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