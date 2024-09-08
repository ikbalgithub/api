import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Profile } from './profile.module';

@Injectable() export class ProfileService {
  constructor(@InjectModel('Profile') private profile: Model<Profile>){}
}
