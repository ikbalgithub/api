import { Model } from 'mongoose';
import { Result } from '../../../index.d'
import { LoginDto } from '../../dtos/login.dto'
import { User } from '../../schemas/user.schema'
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Aggregate } from 'mongoose'


@Injectable() export class UserService {
  
  constructor(@InjectModel(User.name) private user: Model<User>){}

  // find user by username and password

  login(credential:LoginDto):Aggregate<Result.User.Login[]>{
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

}
