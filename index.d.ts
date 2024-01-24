import { Types } from 'mongoose'
import { Message } from './schemas/message.schema'
import { Profile } from './schemas/profile.schema'


export namespace Common{
  export interface LogMessage {
    delay:number,
    status:number,
    url:string,
    method:string
  }

  export interface Jwt{
    _id:string
  }
}
