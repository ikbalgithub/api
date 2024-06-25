import { Connection,Channel,connect } from 'amqplib'
import { Injectable, OnModuleInit } from '@nestjs/common';

@Injectable() export class RabbitmqService implements OnModuleInit {
  
  connection:Connection
  channels:{[id:string]:Channel}


  async onModuleInit(){
    try{
      this.connection = await connect(process.env.RABBITMQ_URL)
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
        await this.channels[id].consume(
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

  async createQueue(id:string,queue:string):Promise<void>{
    return new Promise(async (resolve,reject) => {
      try{
        await this.channels[id].assertQueue(
          queue,{durable:true}
        )
        await this.channels[id].bindQueue(
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
      this.channels[id].close()
    }
    catch(err:any){
      console.log(err)
    }
  }

  send(id:string,routingKey:string,message:string){
    this.channels[id].publish(
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
