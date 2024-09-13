import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Message } from './message.module';
import { Aggregate, Model, Types } from 'mongoose';

@Injectable() export class MessageService {
  constructor(@InjectModel('Message') private message: Model<Message>){}

  getRecently(filter:{sender:Types.ObjectId,accept:Types.ObjectId}){
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
      {$addFields:{
        sentByOwn:{
          $cond:{
            if:{$eq:['$sender',filter.sender]},
            then:true,
            else:false
          }
        }
      }},
      {$lookup:{
        from:"profiles",
        as:"sender.profile",
        localField:"sender",
        foreignField:"usersRef"
      }},
      {$lookup:{
        from:"profiles",
        as:"accept.profile",
        localField:"accept",
        foreignField:"usersRef"
      }},
      {$unwind:{
        path:"$sender.profile"
      }},
      {$unwind:{
        path:"$accept.profile"
      }},
      {$addFields:{
        'sender.profile':{
          cond:{
            if:{$eq:['$sentByOwn',true]},
            then:'$sender.profile',
            false:'$accept.profile'
          }
        }
      }},
      {$addFields:{
        'sender._id':'$sender.profile.usersRef'
      }},
      {$project:{
        'accept':0,
        'sender.profile._id':0,
        'sender.profile.usersRef':0
      }}
    ])
  }

  getLast(references:Types.ObjectId[],user:Types.ObjectId):Aggregate<(Message&{unreadCounter:number})[]>{
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
