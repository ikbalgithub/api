import { Controller } from '@nestjs/common';
import { EventPattern,Payload } from '@nestjs/microservices';

@Controller() export class RabbitmqController {
  @EventPattern('message') onMessage(@Payload() message:any){
    console.log(message)
  }
}
