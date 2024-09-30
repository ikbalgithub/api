import { Types } from 'mongoose';
import { Module } from '@nestjs/common';
import { MessageService } from './message.service';
import { MessageResolver } from './message.resolver';
import { MongooseModule, Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { EventsModule } from 'src/events/events.module';

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

const schema = SchemaFactory.createForClass(
  Message
)

@Module({
  imports:[
    EventsModule,
    MongooseModule.forFeature([
      {
        name:'Message',
        schema:schema
      }
    ])
  ],
  providers:[
    MessageService,
    MessageResolver
  ],
  exports:[
    MessageService
  ]
})
export class MessageModule {}
