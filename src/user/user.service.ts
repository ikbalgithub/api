import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { User } from './user.module';
import { Profile } from 'src/profile/profile.module';

@Injectable() export class UserService {
  constructor(@InjectModel('User') private user: Model<User>){}

  async findByUsername(username:string,user:Types.ObjectId):Promise<(User&{profile:Profile})[]>{
    return this.user.aggregate(
      [
        {$match:{
          username:{
            $regex: new RegExp(
              `^${username}`,"i"
            )
          },
          _id:{
            $ne:user
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
        {$project:{
          username:0,
          password:0,
          oauthReference:0
        }}
      ]
    )
  }
}
