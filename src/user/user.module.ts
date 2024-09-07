import { Module } from '@nestjs/common';
import { UserResolver } from './user.resolver';
import { UserService } from './user.service';
import { MongooseModule, Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';


@Schema()
export class User{
  @Prop() _id:Types.ObjectId
  
  @Prop() oauthReference?:string
  
  @Prop() username?:string
 
  @Prop() password?:string
}

@Module({
  imports:[
    MongooseModule.forFeature(
      [
        {
          name:'User',
          schema:SchemaFactory.createForClass(User)
        }
      ]
    )
  ],
  providers:[
    UserResolver,
    UserService
  ]
}) 
export class UserModule {

}
