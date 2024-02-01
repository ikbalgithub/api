import { Injectable } from '@nestjs/common';
import { Aggregate } from 'mongoose'
import { InjectModel } from '@nestjs/mongoose';
import { Model,Types } from 'mongoose';
import { Profile } from '../../schemas/profile.schema'



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

  async new(newProfile:Profile):Promise<Profile>{
    return new this.profile(newProfile).save()
  }

  async update(newProfile:Profile):Promise<Profile>{
    var {_id,...updatedFields} = newProfile
    return this.profile.findOneAndUpdate(
      _id,
      updatedFields,
      {
        new:true
      }
    )
  }
}
