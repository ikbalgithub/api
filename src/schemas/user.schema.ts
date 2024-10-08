import { Prop, Schema,SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose'

@Schema() 
export class User{
  @Prop() _id:Types.ObjectId
  
  @Prop() oauthReference?:string
  
  @Prop() username?:string
 
  @Prop() password?:string
}



export const userSchema = SchemaFactory.createForClass(
  User
)