import { Prop, Schema,SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose'

@Schema() 

export class Friend{
  @Prop() _id:Types.ObjectId
  
  @Prop() reference:Types.ObjectId
  
  @Prop() list:{with:Types.ObjectId,from:number}[]
 }



export const friendSchema = SchemaFactory.createForClass(
  Friend
)