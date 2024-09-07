import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './user.module';

@Injectable() export class UserService {
  constructor(@InjectModel('User') private user: Model<User>){}

  async findByUsername(username:string){
    return this.user.aggregate(
      [
        {$match:{
          username:{
            $regex: new RegExp(
              `^${username}`,"i"
            )
          }
        }}
      ]
    )
  }
}
