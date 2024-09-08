import { Module } from '@nestjs/common';
import { MongooseModule, Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { ProfileResolver } from './profile.resolver';
import { ProfileService } from 'src/services/profile/profile.service';

@Schema()
export class Profile{
  @Prop({required:true}) _id:Types.ObjectId
  @Prop({required:true}) profileImage:string
  @Prop({required:true}) surname:string
  @Prop({required:true}) firstName:string
  @Prop({required:true}) usersRef:Types.ObjectId
}


@Module({
  imports:[
    MongooseModule.forFeature(
      [
        {
          name:'Profile',
          schema:SchemaFactory.createForClass(Profile)
        }
      ]
    )
  ],
  providers:[
    ProfileResolver,
    ProfileService
  ]
}) 
export class ProfileModule {}
