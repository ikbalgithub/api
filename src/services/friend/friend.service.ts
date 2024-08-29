import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Friend } from 'src/schemas/friend.schema';

@Injectable() export class FriendService {
  constructor(@InjectModel(Friend.name) private friend: Model<Friend>){}
  async request(params:{from:Types.ObjectId,to:Types.ObjectId}){
    var pending = {with:params.to,status:'pending'}
    var requested = {with:params.from,status:'requested'}

    return this.friend.bulkWrite(
      [
        {
          updateMany:{
            filter:{reference:params.to},
            update:{$push:{list:{...requested}}}
          }
        },
        {
          updateMany:{
            filter:{reference:params.from},
            update:{$push:{list:{...pending}}}
          }
        }
      ]
    )
  }
}
