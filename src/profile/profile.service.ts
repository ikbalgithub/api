import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Profile } from './profile.module';

@Injectable() export class UserService {
  constructor(@InjectModel('User') private user: Model<Profile>){}
}
