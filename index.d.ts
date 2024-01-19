import { Types } from 'mongoose'

export interface LogMessage {
  delay:number,
  status:number,
  url:string,
  method:string
}

export interface Jwt{
  _id:string | undefined
}

export interface Profile{
  profileImage:string,
  surname:string,
  firstName:string
}


export namespace Result{
  namespace Message{
    interface Recently{
      sender:Profile & {
        usersRef:string
      },
      value:string,
      groupId:Types.ObjectId,
      accept:Profile & {
        usersRef:string
      },
      sendAt:number,
      read:boolean,
      contentType:string,
      description:string,
      unreadCounter:number
    }

    interface All{
      sender:Types.ObjectId,
      groupId:Types.ObjectId,
      accept:Types.ObjectId,
      value:string,
      sendAt:number,
      read:boolean,
      contentType:string,
      description:string
    }

    type New = Criteria.Message.New & {
      _id:Types.ObjectId,
    }
  }

  namespace User{
    interface Login{
      _id:string,
      profile:Profile
    }
  }

  namespace Profile{
    interface Find{
      _id:Types.ObjectId,
      profileImage:string,
      surname:string,
      firstName:string,
      usersRef:Types.ObjectId,
    }
  }

}

// interface / custom type kriteria aggregate

export namespace Criteria{
  namespace Message{
    interface Recently {
      sender:Types.ObjectId,
      accept:Types.ObjectId
    }

    interface All{
      sender:Types.ObjectId,
      accept:Types.ObjectId
    }

    interface New{
      _id:Types.ObjectId,
      sender:Types.ObjectId,
      accept:Types.ObjectId,
      groupId:Types.ObjectId,
      value:string,
      sendAt:number,
      read:boolean,
      contentType:string,
      description:string
    }
  }
}



