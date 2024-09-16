import { Types } from 'mongoose'
import { Field, ID, InterfaceType, ObjectType, } from '@nestjs/graphql';
import { Profile } from 'src/profile/profile.model';


@ObjectType() export class Message<T1,T2>{
  @Field(r => ID) 
  _id:Types.ObjectId
    
  @Field(r => ID) 
  sender:T1
    
  @Field(r => String) 
  value:string
    
  @Field(r => ID) 
  groupId:Types.ObjectId
    
  @Field(r => ID) 
  accept:T2
    
  @Field(r => Number) 
  sendAt:number
    
  @Field(r => Boolean) 
  read:boolean
    
  @Field(r => String) 
  contentType:string
    
  @Field(r => String) 
  description:string
}
  