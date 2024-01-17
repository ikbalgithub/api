import { JwtModule } from '@nestjs/jwt'
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { User,userSchema } from './schemas/user.schema'
import { Message,messageSchema } from './schemas/message.schema'
import { UserService } from './services/user/user.service';
import { UserController } from './controllers/user/user.controller';
import { LoggerMiddleware } from './middlewares/logger/logger.middleware'
import { Module,NestModule,MiddlewareConsumer } from '@nestjs/common';
import { CommonService } from './services/common/common.service';
import { MessageService } from './services/message/message.service';
import { MessageController } from './controllers/message/message.controller';
import { EventsGateway } from './gateways/events/events.gateway';


@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot(
      process
      .env
      .DATABASE_URI
    ),
    MongooseModule.forFeature(
      [
        {
          name:User.name,
          schema:userSchema
        },
        {
          name:Message.name,
          schema:messageSchema
        }
      ]
    ),
    JwtModule.register({
      secret:process.env.JWT_SECRET_KEY,
      global:true,
    })
  ],
  controllers: [
    AppController,
    UserController,
    MessageController
  ],
  providers: [
    AppService,
    UserService,
    CommonService,
    MessageService,
    EventsGateway
  ]
})
export class AppModule implements NestModule{
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware)
    .forRoutes(
      '*'
    )
  }
}
