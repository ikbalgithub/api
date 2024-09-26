import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Message } from './message.module';
import { Aggregate, Model, Types } from 'mongoose';

@Injectable() export class MessageService {
  constructor(@InjectModel('Message') private message: Model<Message>){}

  // fungsi ini bertujuan mengembalikan daftar riwayat interaksi terakhir

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
        'sender._id':'$sender.profile.usersRef'
      }},
      {$addFields:{
        'accept._id':'$accept.profile.usersRef'
      }}
    ])
  }

  // fungsi ini bertujuan mencari tahu interakasi terakhir user dengan salah seorang user yang lain

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
        accept:{$last:'$accept'},
        groupId:{$last:'$groupId'}, 
        sendAt:{$last:'$sendAt'}, 
        read:{$last:'$read'}, 
        contentType:{$last:'$contentType'}, 
        description:{$last:'$description'}, 
      }}
    ])
  }

  // fungsi ini bertujuan memperluas suatu objek pesan

  populate(_id:Types.ObjectId){
    return this.message.aggregate([
      {$match:{
        _id
      }},
      {$addFields:{
        sentByOwn:false
      }},,
      {$lookup:{
        from:"profiles",
        as:"sender.profile",
        localField:"accept",
        foreignField:"usersRef"
      }},
      {$unwind:{
        path:"$sender.profile"
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
}
