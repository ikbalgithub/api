import { Injectable } from '@nestjs/common';
import { EventPattern,Payload } from '@nestjs/microservices';

@Injectable()
export class AppService {
  @EventPattern('message') getMessage(@Payload() message:any){
    console.log(message)
  }
}
