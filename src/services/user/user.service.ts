import { Model,Types } from 'mongoose';
import { Result,Oauth } from '../../../index.d'
import { LoginDto } from '../../dtos/login.dto'
import { User } from '../../schemas/user.schema'
import { Profile } from '../../schemas/profile.schema'
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Aggregate } from 'mongoose'


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

  findByOauthReference(id:string):Aggregate<({_id:Types.ObjectId} & Omit<Profile,'_id|usersRef'>)[]>{
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
        username:0,
        password:0,
        oauthReference:0,
        profile:{
          _id:0,
          usersRef:0
        }
      }}
    ])
  }

  newAccountByGoogleInfo(newOauthAccount:User):Promise<any>{
    return new this.user(newOauthAccount).save()
  }

}
