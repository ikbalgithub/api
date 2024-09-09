import { Types } from 'mongoose'
import { Field, ID, ObjectType, } from '@nestjs/graphql';
import { Profile } from 'src/profile/profile.model';
import { Message } from 'src/message/message.model';

@ObjectType() export class User{
  @Field(r => ID)
  _id:Types.ObjectId

  @Field({nullable:true})
  oauthReference:string
  
  @Field({nullable:true}) 
  username:string
 
  @Field({nullable:true})
  password:string
}

