import { JwtModule } from '@nestjs/jwt'
import { AppController } from './app.controller';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { User,userSchema } from './schemas/user.schema'
import { Message,messageSchema } from './schemas/message.schema'
import { Profile,profileSchema } from './schemas/profile.schema'
import { Friend,friendSchema } from './schemas/friend.schema'
import { AppService } from './app.service';
import { UserService } from './services/user/user.service';
import { UserController } from './controllers/user/user.controller';
import { LoggerMiddleware } from './middlewares/logger/logger.middleware'
import { Module,NestModule,MiddlewareConsumer } from '@nestjs/common';
import { CommonService } from './services/common/common.service';
import { MessageService } from './services/message/message.service';
import { MessageController } from './controllers/message/message.controller';
import { EventsGateway } from './gateways/events/events.gateway';
import { ProfileService } from './services/profile/profile.service';
import { OauthController } from './controllers/oauth/oauth.controller';
import { ProfileController } from './controllers/profile/profile.controller';
import { RedisService } from './services/redis/redis.service';
import { RedisClientOptions } from 'redis';
import * as redisStore from 'cache-manager-redis-store'
import { CacheModule } from '@nestjs/cache-manager';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { UserModule } from './user/user.module';
import { ProfileModule } from './profile/profile.module';
import { MessageModule } from './message/message.module';
import { EventsModule } from './events/events.module';
import { RedisModule } from './redis/redis.module';
@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot(
      process.env.DATABASE_URI
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
        },
        {
          name:Profile.name,
          schema:profileSchema
        },
        {
          name:Friend.name,
          schema:friendSchema
        }
      ]
    ),
    JwtModule.register({
      secret:process.env.JWT_SECRET_KEY,
      global:true,
    }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver:ApolloDriver,
      playground:true,
      introspection: true,
      autoSchemaFile:'schema.gql',
      include:[UserModule,ProfileModule,MessageModule],
      context: ({req,res}) => ({req,res}),
    }),
    UserModule,
    ProfileModule,
    MessageModule,
    EventsModule,
    RedisModule
  ],
  controllers: [
    AppController,
    UserController,
    MessageController,
    OauthController,
    ProfileController,
  ],
  providers: [
    AppService,
    UserService,
    CommonService,
    MessageService,
    EventsGateway,
    ProfileService,
    RedisService,
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
