import { User } from './user.model'
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable() export class UserService {
  
  constructor(@InjectModel('User') private user: Model<User>){}

  async findByUsername(username:string):Promise<any[]>{
    return this.user.aggregate(
      [
        {
          $match:{
            $regex: new RegExp(
              `^${username}`, "i"
            )
          }
        }
      ]
    )
  }

}
