import { Connection,Channel,connect } from 'amqplib'
import { Injectable, OnModuleInit } from '@nestjs/common';

@Injectable() export class RabbitmqService implements OnModuleInit {
  queues:{socketId:string,consumerTag:string}[] = []
  
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

  async consume(queue:string,socketId:string,onMessage:(message:{content:Buffer}) => void){
    try{
      var result = await (this.channel as Channel).consume(
        queue,onMessage,{noAck:false}
      )

      this.queues.push(
        {
          socketId,
          consumerTag:result.consumerTag
        }
      )

      console.log(this.queues)
    }
    catch(e:any){
      console.log(e.message)
    }
  }

  async createQueue(queue:string){
    try{
      await this.channel.assertQueue(
        queue,{
          durable: true
        }
      )

      await (this.channel as Channel).bindQueue(
        queue,'socket',queue
      )
    }
    catch(e:any){
      console.log(e.message)
    }
  }

  async stopConsume(socketId:string){
    try{
			var [{consumerTag}] = this.queues.filter(
				q => q.socketId === socketId
			)
	
			var index = this.queues.findIndex(
				q => q.socketId === socketId
			)
	
			await (this.channel as Channel).cancel(
				consumerTag
			)

			this.queues.splice(index,1)
    }
    catch(e:any){
      console.log(e.message)
    }
    
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
