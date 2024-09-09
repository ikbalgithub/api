import { Types } from 'mongoose'
import { Field, ID, ObjectType, } from '@nestjs/graphql';
import { Profile } from 'src/profile/profile.model';

@ObjectType() export class Message{
  @Field(r => ID) 
  _id:Types.ObjectId
    
  @Field(r => ID,{nullable:true}) 
  sender:Types.ObjectId
    
  @Field({nullable:false}) 
  value:string
    
  @Field(r => ID,{nullable:true}) 
  groupId:Types.ObjectId
    
  @Field(r => ID,{nullable:true}) 
  accept:Types.ObjectId
    
  @Field({nullable:true}) 
  sendAt:number
    
  @Field({nullable:true}) 
  read:boolean
    
  @Field({nullable:true}) 
  contentType:string
    
  @Field({nullable:true}) 
  description:string
}
  