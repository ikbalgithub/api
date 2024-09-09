import { Module } from '@nestjs/common';
import { MessageService } from './message.service';
import { MongooseModule, Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';

@Schema() export class Message{
  @Prop({required:true}) _id:Types.ObjectId
  @Prop({required:true}) sender:Types.ObjectId
  @Prop({required:true}) value:string
  @Prop({required:true}) groupId:Types.ObjectId
  @Prop({required:true}) accept:Types.ObjectId
  @Prop({required:true}) sendAt:number
  @Prop({required:true}) read:boolean
  @Prop({required:true}) contentType:string
  @Prop({required:true}) description:string
}

@Module({
  imports:[
    MongooseModule.forFeature([
      {
        name:'Message',
        schema:SchemaFactory.createForClass(Message)
      }
    ])
  ],
  providers:[
    MessageService
  ],
  exports:[
    MessageService
  ]
})
export class MessageModule {}
