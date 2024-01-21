import { Injectable } from '@nestjs/common';
import { Aggregate } from 'mongoose'
import { InjectModel } from '@nestjs/mongoose';
import { Model,Types } from 'mongoose';
import { Profile } from '../../schemas/profile.schema'
import { Result } from '../../../index.d'



@Injectable() export class ProfileService {
  
  constructor(@InjectModel(Profile.name) private profile: Model<Profile>){}

  find(v:string,user:Types.ObjectId):Aggregate<Profile[]>{
    return this.profile.aggregate([
       {$match:{
        firstName:{
          $regex: new RegExp(
            `^${v}`, "i"
          )
        },
        usersRef:{
          $ne:user
        }
      }}
    ])
  }
}
