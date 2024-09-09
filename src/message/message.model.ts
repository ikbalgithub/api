import { Types } from 'mongoose'
import { Field, ID, ObjectType, } from '@nestjs/graphql';
import { Profile } from 'src/profile/profile.model';

@ObjectType() export class Message{
  @Field(r => ID) 
  _id:Types.ObjectId
    
  @Field(r => ID,{nullable:false}) 
  sender:Types.ObjectId
    
  @Field({nullable:false}) 
  value:string
    
  @Field(r => ID,{nullable:false}) 
  groupId:Types.ObjectId
    
  @Field(r => ID,{nullable:false}) 
  accept:Types.ObjectId
    
  @Field({nullable:false}) 
  sendAt:number
    
  @Field({nullable:false}) 
  read:boolean
    
  @Field({nullable:false}) 
  contentType:string
    
  @Field({nullable:false}) 
  description:string
}
  