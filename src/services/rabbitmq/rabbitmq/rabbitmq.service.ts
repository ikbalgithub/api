import { Connection,Channel,connect } from 'amqplib'
import { Injectable, OnModuleInit } from '@nestjs/common';

@Injectable() export class RabbitmqService implements OnModuleInit {
  consumers:{[id:string]:string[]} = {}
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


  consume(id:string,queue:string,onMessage:(message:{content:Buffer}) => void):Promise<string>{
    return new Promise(async (resolve,reject) => {
      try{
        var r = await this.channel?.consume(
          queue,onMessage,{noAck:false}
        )

        this.consumers[id] = [
          ...this.consumers[id],
          r.consumerTag
        ]

        resolve(
          r.consumerTag
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

  async stopConsume(id:string,index){    
    try{
      await this.channel.cancel(
        this.consumers[id][0]
      )

      this.consumers[id].splice(
        index,1
      )

      if(this.consumers[id].length > 0){
        this.stopConsume(id,0)
      }
      else{
        delete this.consumers[id]
      }
    }
    catch(err:any){
      console.log(err.message)
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
}
