import { Types } from 'mongoose'
import { Field, ID, InterfaceType, ObjectType, } from '@nestjs/graphql';
import { Profile } from 'src/profile/profile.model';


@ObjectType() export class Message<T1,T2>{
  @Field(r => ID) 
  _id:Types.ObjectId
    
  @Field(r => ID,{nullable:false}) 
  sender:T1
    
  @Field({nullable:false}) 
  value:string
    
  @Field(r => ID,{nullable:true}) 
  groupId:Types.ObjectId
    
  @Field(r => ID,{nullable:true}) 
  accept:T2
    
  @Field({nullable:true}) 
  sendAt:number
    
  @Field({nullable:true}) 
  read:boolean
    
  @Field({nullable:true}) 
  contentType:string
    
  @Field({nullable:true}) 
  description:string
}
  