import { Injectable } from '@nestjs/common';
import { EventPattern,Payload } from '@nestjs/microservices';

@Injectable() export class AppService {
  @EventPattern('microservice') onMessage(@Payload() payload:any){
    console.log(payload)
  }
}
