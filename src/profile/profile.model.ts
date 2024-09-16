import { Types } from 'mongoose'
import { Field, ID, ObjectType, } from '@nestjs/graphql';

@ObjectType() export class Profile {
  @Field(r => ID)
  _id: Types.ObjectId
  
  @Field(r => String)
  profileImage:string

  @Field(r => String)
  firstName:string

  @Field(r => String)
  surname:string

  @Field(r => ID)
  usersRef:Types.ObjectId
}