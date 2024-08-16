import { Controller } from '@nestjs/common';
import { EventPattern,Payload } from '@nestjs/microservices';
import { EventsGateway } from './gateways/events/events.gateway';

@Controller() export class AppController {
  @EventPattern('message') onTest(@Payload() message:string){
    var [eventName,destination,value] = message.split('~')   
    
    this.gateway.emit(
      eventName,
      destination,
      value
    )
  }

  constructor(private gateway:EventsGateway){
    //importing events gateway
  }
}

