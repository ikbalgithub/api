import { Args, Context, Field, ID, Int, InterfaceType, Mutation, ObjectType, Query, Resolver } from '@nestjs/graphql';
import { GraphQLError } from 'graphql';
import { UseGuards } from '@nestjs/common';
import { GraphqlGuard } from 'src/guards/graphql/graphql.guard';
import { Types } from 'mongoose';
import { Profile } from 'src/profile/profile.model';
import { Message } from 'src/message/message.model';
import { MessageService } from 'src/message/message.service'

@Resolver() export class MessageResolver {
  constructor(private readonly messageService:MessageService) {}

  @Query(r => [M]) @UseGuards(GraphqlGuard) async fetchHistory(@Context() ctx){
    try{
      return await this.messageService.getRecently(
        {
          sender:new Types.ObjectId(
            ctx.req.user._id
          ),
          accept:new Types.ObjectId(
            ctx.req.user._id
          )
        }
      )
    }
    catch(err:any){
      throw new GraphQLError(err.message)
    }
  }
}

@ObjectType() class Sender{
  @Field(r => ID)
  _id:Types.ObjectId
  @Field(r => Profile,{nullable:false})
  profile:Profile
}

@ObjectType() class Accept{
  @Field(r => ID)
  _id:Types.ObjectId
  @Field(r => Profile,{nullable:false})
  profile:Profile
}

@ObjectType() class M extends Message<Sender,Accept>{ 
  @Field(r => Sender)
  sender:Sender
  @Field({nullable:false})
  sentByOwn:boolean
  @Field({nullable:false})
  unreadCounter:number
}

