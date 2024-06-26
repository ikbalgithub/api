import { Connection,Channel,connect } from 'amqplib'
import { Injectable, OnModuleInit } from '@nestjs/common';

@Injectable() export class RabbitmqService implements OnModuleInit {
  consumers:{id:string,consumerTag:string}[] = []
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

        this.consumers = [
          ...this.consumers,
          {id,consumerTag:r.consumerTag}
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

  stopConsume(id:string){    
    var target = this.consumers.filter(
      c => c.id === id
    )
    
    if(target.length > 0){
      target.forEach(async c => {
        try{
          await this.channel?.cancel(
            c.consumerTag
          )
          var index = this.consumers.findIndex(
            _c => _c.consumerTag === c.consumerTag
          )
  
          this.consumers.splice(index,1)
        
        }
        catch(err:any){
          console.log(err.message)
        }
      })
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

  ack(message:{content:Buffer}){
    this.channel?.ack(message)
  }
}
