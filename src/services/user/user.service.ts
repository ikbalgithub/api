import { Model,Types } from 'mongoose';
import { LoginDto } from '../../dtos/login.dto'
import { AccountUpdate } from '../../dtos/account-update.dto'
import { User } from '../../schemas/user.schema'
import { Profile } from '../../schemas/profile.schema'
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Aggregate,UpdateWriteOpResult } from 'mongoose'

@Injectable() export class UserService {
  
  constructor(@InjectModel(User.name) private user: Model<User>){}

  // find user by username and password

  login(credential:LoginDto):Aggregate<({_id:Types.ObjectId} & Omit<Profile,'_id|usersRef'>)[]>{
    return this.user.aggregate([
      {$match:{
      	...credential,
      }},
      {$lookup:{
        from:"profiles",
        localField:"_id",
        foreignField:"usersRef",
        as:"profile",
      }},
      {$unwind:{
        path:"$profile",
      }},
      {$project:{
        username:0,
        password:0,
        profile:{
          _id:0,
          usersRef:0
        }
      }}
    ])
  }

  findByOauthReference(id:string):Aggregate<({_id:Types.ObjectId,username:string} & Omit<Profile,'_id|usersRef'>)[]>{
    return this.user.aggregate([
      {$match:{
        oauthReference:id
      }},
      {$lookup:{
        from:"profiles",
        localField:"_id",
        foreignField:"usersRef",
        as:"profile",
      }},
      {$unwind:{
        path:"$profile",
      }},
      {$project:{
        password:0,
        oauthReference:0,
        profile:{
          usersRef:0
        }
      }}
    ])
  }

  findByUsername(username:string,from:Types.ObjectId):Aggregate<{profile:Profile,friends:boolean}[]>{
    return this.user.aggregate([
      {$match:{
        username:{
          $regex: new RegExp(
            `^${username}`, "i"
          )
        },
        _id:{
          $ne:from
        }
      }},
      {$lookup:{
        from:'profiles',
        localField:'_id',
        foreignField:'usersRef',
        as:'profile'
      }},
      {$unwind:{
        path:'$profile'
      }},
      {$lookup:{
        from:'friends',
        localField:'_id',
        foreignField:'reference',
        as:'friends'
      }},
      {$unwind:{
        path:"$friends"
      }},
      {$addFields:{
        friends:{
          $gt:[
           {$size:{
             $filter:{
               input:"$friends.list",
               as:"item",
               cond:{$eq:["$$item.with",from]}
             }
           }},
           0
          ]
        }
      }},
      {$project:{
        username:0,
        password:0,
        oauthReferences:0
      }}
    ])
  }

  update(_id:Types.ObjectId,update:AccountUpdate){
    return this.user.updateOne(
      {_id},
      update
    )
  }

  new(newOauthAccount:User):Promise<User>{
    return new this.user(
      newOauthAccount
    )
    .save()
  }

}
