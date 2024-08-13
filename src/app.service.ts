import { Injectable } from '@nestjs/common';
import { MessagePattern,Payload } from '@nestjs/microservices';

@Injectable() export class AppService {
  @MessagePattern('microservice') onMessage(@Payload() payload:any){
    console.log(payload)
  }
}
