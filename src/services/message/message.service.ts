import { Model,Types } from 'mongoose';
import { Criteria,Result } from '../../../index.d'
import { Message } from '../../schemas/message.schema'
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Aggregate,Document } from 'mongoose'

@Injectable() export class MessageService {
   
  constructor(@InjectModel(Message.name) private message: Model<Message>){}

  getAll<Filter>($or:[Filter,Filter]):Aggregate<Result.Message.All[]>{
    return this.message.aggregate([
      {$match:{
        $or
      }} 
    ])
  }

  getRecently<Filter>(filter:Filter):Aggregate<Result.Message.Recently[]>{
    var $or = Object.keys(filter).map(key => ({[key]:filter[key]}))
    
    return this.message.aggregate([
      {$match:{
        $or
      }}, 
      {$group:{
        _id:"$groupId",
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
      }}, 
      {$lookup:{
        from:"profiles",
        as:"sender",
        localField:"sender",
        foreignField:"usersRef"
      }},
      {$lookup:{
        from:"profiles",
        as:"accept",
        localField:"accept",
        foreignField:"usersRef"
      }},
      {$unwind:{
        path:"$sender"
      }},
      {$unwind:{
        path:"$accept"
      }},
      {$project:{
        _id:0, 
        sender:{
          _id:0
        },
        accept:{
          _id:0
        }
      }}
    ])
  }

  async new<New>(newMessage:New):Promise<Result.Message.New>{
    return new this.message(newMessage).save()
  }

  async updateOnRead(_id:Types.ObjectId):Promise<Result.Message.New>{
    return this.message.findByIdAndUpdate(
      _id,
      {
        read:true
      },
      {
        new:true,
      }
    )
  }

  recently(_ids:any[],user:Types.ObjectId):Promise<(Result.Message.Recently & {sender:Types.ObjectId,accept:Types.ObjectId})[]>{
    return this.message.aggregate([
      {$match:{
        $or:[
          {
            sender:{
              $in:_ids
            }
          },
          {
            accept:{
              $in:_ids
            }
          }
        ]
      }},
      {$match:{
        $or:[
          {
            sender:user
          },
          {
            accept:user
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

  populate(_id:Types.ObjectId):Aggregate<Result.Message.Populated[]>{
    return this.message.aggregate([
      {$match:{
        _id
      }},
      {$lookup:{
        from:"profiles",
        as:"sender",
        localField:"sender",
        foreignField:"usersRef"
      }},
      {$lookup:{
        from:"profiles",
        as:"accept",
        localField:"accept",
        foreignField:"usersRef"
      }},
      {$unwind:{
        path:"$sender"
      }},
      {$unwind:{
        path:"$accept"
      }}
    ])
  }
}


        