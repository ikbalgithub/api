import { Model,Types } from 'mongoose';
import { Message,Last_Message } from '../../schemas/message.schema'
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Aggregate,UpdateWriteOpResult } from 'mongoose'

@Injectable() export class MessageService {
   
  constructor(@InjectModel(Message.name) private message: Model<Message>){}

  getAll<Filter>($or:[Filter,Filter]):Aggregate<Message[]>{
    return this.message.aggregate([
      {$match:{
        $or
      }}
    ])
  }

  getRecently<Filter>(filter:Filter):Aggregate<Last_Message[]>{
    var $or = Object.keys(filter).map(k => ({[k]:filter[k]}))

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

  async new(newMessage:Message):Promise<Message>{
    return new this.message(newMessage).save()
  }

  async updateOnRead(_id:Types.ObjectId):Promise<UpdateWriteOpResult>{
    return this.message.updateMany(
      {
        sender:_id,
        read:false
      },
      {
        read:true
      }
    )
    // return this.message.findByIdAndUpdate(
    //   _id,
    //   {
    //     read:true
    //   },
    //   {
    //     new:true,
    //   }
    // )
  }

  recently(references:Types.ObjectId[],from:Types.ObjectId):Promise<Last_Message[]>{
    var sender = { $in:references }
    var accept = { $in:references }
    
    return this.message.aggregate([
      {$match:{
        $or:[
          {
            sender,
            accept:from
          },
          {
            accept,
            sender:from
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

  populate(_id:Types.ObjectId):Aggregate<Omit<Last_Message,"unreadCounter">[]>{
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


        