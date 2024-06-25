import { Connection,Channel,connect } from 'amqplib'
import { Injectable, OnModuleInit } from '@nestjs/common';

@Injectable() export class RabbitmqService implements OnModuleInit {
  consumers:{[id:string]:string} = {}
  connection:Connection
  channel:Channel

  

  async onModuleInit(){
    try{
      this.connection = await connect(process.env.RABBITMQ_URL)
      this.channel = await this.connection.createChannel()
    }
    catch(e:any){
      console.log(e.message)
    }
  }

  async createChannel(id:string){
    try{
      var channel = await this.connection.createChannel()
      this.channels[id] = channel
    }
    catch(err:any){
      console.log(err.message)
    }
  }

  consume(id:string,queue:string,onMessage:(message:{content:Buffer}) => void):Promise<void>{
    return new Promise(async (resolve,reject) => {
      try{
        await this.channel?.consume(
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
        await this.channel?.assertQueue(
          queue,{durable:true}
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

  async stopConsume(id:string){
    try{
      await this.channel.cancel(
        this.consumers[id]
      )
    }
    catch(err:any){
      console.log(err)
    }
  }

  send(routingKey:string,message:string){
    this.channel?.publish(
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
