import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Message } from './message.module';
import { Aggregate, Model, Types } from 'mongoose';

@Injectable() export class MessageService {
  constructor(@InjectModel('Message') private message: Model<Message>){}

  getLast(references:Types.ObjectId[],user:Types.ObjectId):Aggregate<Message[]>{
    var sender = { $in:references }
    var accept = { $in:references }

    return this.message.aggregate([
      {$match:{
        $or:[
          {
            sender,
            accept:user
          },
          {
            accept,
            sender:user
          }
        ]
      }},
      {$group:{
        _id:'$groupId',
        sender:{$last:'$sender'}, 
        value:{$last:'$value'},
        groupId:{$last:'$groupId'}, 
        accept:{$last:'$accept'},
        sendAt:{$last:'$sendAt'}, 
        read:{$last:'$read'}, 
        contentType:{$last:'$contentType'}, 
        description:{$last:'$description'}, 
        unreadCounter:{
          $sum:{
            $cond:{
              if:{
                $eq:[
                  '$read', 
                  false
                ]
              }, 
              then:1, 
              else:0
            }
          }
        }
      }}
    ])
  }
}
