import { GraphQLError } from 'graphql';
import { UseGuards } from '@nestjs/common';
import { GraphqlGuard } from 'src/guards/graphql/graphql.guard';
import { Types } from 'mongoose';
import { Profile } from 'src/profile/profile.model';
import { Message } from 'src/message/message.model';
import { MessageService } from 'src/message/message.service'
import { OidPipe } from '../pipes/oid/oid.pipe'
import { EventsGateway } from 'src/events/events.gateway';
import * as gql from '@nestjs/graphql';

@gql.Resolver() export class MessageResolver {
  constructor(private messageService:MessageService,private eventsGateway:EventsGateway) {}

  @gql.Query(r => [M]) @UseGuards(GraphqlGuard) async fetchHistory(@gql.Context() ctx){
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
  
  @gql.Query(r => [Message<string,string>]) @UseGuards(GraphqlGuard) async fetchDetail(@gql.Context() ctx, @gql.Args('_id',OidPipe) _id:string){
    const user = new Types.ObjectId(ctx.req.user._id)

    try{
      return await this.messageService.getAll(
         [
          {
            sender: user,
            accept: _id,
          },
          {
            sender:_id,
            accept:user,
          } 
        ]
      )
    }
    catch(err:any){
      throw new GraphQLError(err.message)
    }
  }

  @gql.Mutation(r => Update) @UseGuards(GraphqlGuard) async updateMessage(@gql.Context() ctx,@gql.Args('_id',OidPipe) _id:string,@gql.Args('groupId',OidPipe) gId:string){
    try{
      var update = await this.messageService.update<{sender:string},{read:boolean}>(
        {
          sender:_id
        },
        {
          read:true
        }
      )

      await this.eventsGateway.emit('updated',`${gId.toString()}/${_id.toString()}`,ctx.req.user._id)
      await this.eventsGateway.emit('history/updated',`history/${_id.toString()}`,ctx.req.user._id)

      return {
        modifiedCount:update.modifiedCount
      }
    }
    catch(err:any){
      throw new GraphQLError(err.message)
    }
  }
}

@gql.ObjectType() class Sender{
  @gql.Field(r => gql.ID)
  _id:Types.ObjectId
  @gql.Field(r => Profile,{nullable:false})
  profile:Profile
}

@gql.ObjectType() class Accept{
  @gql.Field(r => gql.ID)
  _id:Types.ObjectId
  @gql.Field(r => Profile,{nullable:false})
  profile:Profile
}

@gql.ObjectType() class M extends Message<Sender,Accept>{ 
  @gql.Field(r => Sender)
  sender:Sender
  @gql.Field(r => Accept)
  accept:Accept
}

@gql.ObjectType() class Update{
  @gql.Field(r => Number)
  modifiedCount:Number
}
