import { Connection,Channel,connect } from 'amqplib'
import { Injectable, OnModuleInit } from '@nestjs/common';

@Injectable() export class RabbitmqService implements OnModuleInit {
  sendChannel:Channel
  acceptChannel:Channel
  connection:Connection

  

  async onModuleInit(){
    try{
      this.connection = await connect(process.env.RABBITMQ_URL)
      this.sendChannel = await this.connection.createChannel()
      this.acceptChannel = await this.connection.createChannel()
    }
    catch(e:any){
      console.log(e.message)
    }
  }


  consume(id:string,queue:string,onMessage:(message:{content:Buffer}) => void):Promise<void>{
    return new Promise(async (resolve,reject) => {
      try{
        await this.acceptChannel?.consume(
          queue,onMessage,{noAck:false}
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

  async createQueue(queue:string):Promise<void>{
    return new Promise(async (resolve,reject) => {
      try{
        await this.acceptChannel?.assertQueue(
          queue, 
          {
            durable:true,
            arguments: {
              'x-queue-type': 'quorum'
            }
          },
          
        )
        await this.acceptChannel?.bindQueue(
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

  async onDisconnect(){
    this.acceptChannel?.close()
    this.acceptChannel = await this.connection.createChannel()
  }

  send(routingKey:string,message:string){
    this.sendChannel?.publish(
      'socket',
      routingKey,
      Buffer.from(message),
      {persistent:true}
    )
  }

  ack(message:{content:Buffer}){
    this.acceptChannel?.ack(
      message
    )
  }
}