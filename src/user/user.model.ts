import { Types } from 'mongoose'
import { Field, ID, ObjectType, } from '@nestjs/graphql';

@ObjectType() export class User {
  @Field(r => ID)
  _id: Types.ObjectId

  @Field({nullable:true})
  oauthReference:string
  
  @Field({nullable:false}) 
  username:string
 
  @Field({nullable:true})
  password:string
}