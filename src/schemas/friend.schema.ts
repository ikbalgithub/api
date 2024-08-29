import { Prop, Schema,SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose'

@Schema() 

export class Friend{
  @Prop() _id:Types.ObjectId
  
  @Prop() reference:Types.ObjectId
  
  @Prop() list:Friendship[]
 }

export const friendSchema = SchemaFactory.createForClass(Friend)

interface Friendship{
  with:Types.ObjectId,
  status:string
}