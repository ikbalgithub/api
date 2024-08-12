import { Server } from 'socket.io'
import { WebSocketServer,WebSocketGateway } from '@nestjs/websockets';

@WebSocketGateway({cors:{origin:'*'}}) export class EventsGateway{
  @WebSocketServer() server:Server
  
}
