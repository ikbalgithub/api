import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './user.module';

@Injectable() export class UserService {
  constructor(@InjectModel('User') private user: Model<User>){}

}
