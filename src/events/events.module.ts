import { Module } from '@nestjs/common';
import { EventsGateway } from './events.gateway';
import { RedisModule } from 'src/redis/redis.module';

@Module({
  imports: [RedisModule],
  providers: [EventsGateway],
  exports: [EventsGateway],
})
export class EventsModule {
  
}
