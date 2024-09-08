import { Types } from 'mongoose'
import { Field, ID, ObjectType, } from '@nestjs/graphql';

@ObjectType() export class Profile {
  @Field(r => ID)
  _id: Types.ObjectId
  
  @Field({nullable:false})
  profileImage:string

  @Field({nullable:false})
  firstName:string

  @Field({nullable:false})
  surname:string

  @Field(r => ID,{nullable:false})
  usersRef:Types.ObjectId
}