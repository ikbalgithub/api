import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Friend } from 'src/schemas/friend.schema';

@Injectable() export class FriendService {
  constructor(@InjectModel(Friend.name) private friend: Model<Friend>){}
  async request(params:{from:Types.ObjectId,to:Types.ObjectId}){
    var pending = {with:params.to,status:'requested'}
    var requested = {with:params.from,status:'pending'}

    return this.friend.bulkWrite(
      [
        {
          updateMany:{
            filter:{reference:params.from},
            update:{$push:{list:{...pending}}}
          }
        },
        {
          updateMany:{
            filter:{reference:params.to},
            update:{$push:{list:{...requested}}}
          }
        }
      ]
    )
  }

  async accept(params:{_id:Types.ObjectId,list:{status:string,with:Types.ObjectId}[]}[]){
    return this.friend.bulkWrite(
      [
        {
          updateMany:{
            filter:{reference:params[0]._id},
            update:{$set:{list:params[0].list}}
          }
        },
        {
          updateMany:{
            filter:{reference:params[1]._id},
            update:{$set:{list:params[1].list}}
          }
        }
      ]
    )
  }

  async setAsAccepted(reference:Types.ObjectId,_id:Types.ObjectId):Promise<Friend[]>{
    return this.friend.aggregate(
      [
        {
          $match:{
            reference
          }
        },
        {
          $addFields:{
            exclude:{
              $filter:{
                as:'e',
                input:'$list',
                cond:{$ne:['$$e.with',_id]}
              }
            }
          }
        },
        {
          $addFields:{
            include:{
              $filter:{
                as:'e',
                input:'$list',
                cond:{$eq:['$$e.with',_id]}
              }
            }
          }
        },
        {
          $addFields:{
            include:{
              $map:{
                as:'e',
                input:'$include',
                in:{
                  with:_id,
                  status:'accepted'
                }
              }
            }     
          }
        },
        {
          $addFields:{
            list:{
              $concatArrays:[
                '$exclude',
                '$include'
              ]
            }
          }
        },
        {
          $project:{
            exclude:0,
            include:0
          }
        }
      ]
    )
  }
}
