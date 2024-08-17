import { Controller } from '@nestjs/common';
import { EventPattern,Payload } from '@nestjs/microservices';
import { EventsGateway } from './gateways/events/events.gateway';

@Controller() export class AppController {
  @EventPattern('message') onTest(@Payload() message:string){
    var [event,dst,value] = message.split('~')   
    this.gateway.emit(event,dst,value)
  }

  constructor(private gateway:EventsGateway){
    //importing events gateway
  }
}

