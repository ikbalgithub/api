import { Connection,Channel,connect,ConsumeMessage } from 'amqplib'
import { Injectable, OnModuleInit } from '@nestjs/common';

@Injectable() export class RabbitmqService implements OnModuleInit {
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

  async consume(queue:string,onMessage:(message:{content:Buffer}) => void){
    try{
      await (this.channel as Channel).consume(
        queue,onMessage,{noAck:true}
      )
    }
    catch(e:any){
      console.log(e.message)
    }
  }
}
