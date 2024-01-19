import { Prop, Schema,SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose' 

@Schema() export class Profile{
  @Prop() profileImage:string
  @Prop() surname:string
  @Prop() firstName:string
  @Prop() usersRef:Types.ObjectId
}

export const profileSchema = SchemaFactory.createForClass(
  Profile
)