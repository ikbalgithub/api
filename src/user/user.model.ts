import { Types } from 'mongoose'
import { Field, ID, ObjectType, } from '@nestjs/graphql';

@ObjectType() export class User {
  @Field((type) => ID)
  _id: Types.ObjectId

  @Field({nullable:true})
  oauthReference:string
  
  @Field({nullable:true}) 
  username:string
 
  @Field({nullable:true})
  password:string
}