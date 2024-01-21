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

  export interface Profile{
    profileImage:string,
    surname:string,
    firstName:string
    usersRef?:string,
    _id?:Types.ObjectId
  }
}

// aggregate interface / custom type result


export namespace Result{
  export type Last_Message = Message & {
    unreadCounter:number,
    sender:Profile,
    accept:Profile
  }

  export type Populated_Message = Omit<
    LastMessage,"unreadCounter"
  >

  interface Oauth{
    data:Oauth.Data
  }

}

// aggregate interface / custom type criteria

export namespace Criteria{
  interface Message_Filter{
    sender:Types.ObjectId,
    accept:Types.ObjectId
  }

  interface Message_Last{
    sender:Types.ObjectId,
    accept:Types.ObjectId
  }
}


export namespace Oauth{
  interface Data{
    id: string,
    email: string,
    verified_email: boolean,
    name: string,
    given_name: string,
    family_name: string,
    picture: string,
    locale: string
  }
}