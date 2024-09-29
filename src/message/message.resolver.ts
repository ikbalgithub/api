import { Args, Context, Field, ID, Int, InterfaceType, Mutation, ObjectType, Query, Resolver } from '@nestjs/graphql';
import { GraphQLError } from 'graphql';
import { UseGuards } from '@nestjs/common';
import { GraphqlGuard } from 'src/guards/graphql/graphql.guard';
import { Types } from 'mongoose';
import { Profile } from 'src/profile/profile.model';
import { Message } from 'src/message/message.model';
import { MessageService } from 'src/message/message.service'
import { OidPipe } from '../pipes/oid/oid.pipe'
import { EventsGateway } from '../gateways/events/events.gateway'

@Resolver() export class MessageResolver {
  constructor(private message:MessageService,private gateway:EventsGateway) {}

  @Query(r => [M]) @UseGuards(GraphqlGuard) async fetchHistory(@Context() ctx){
    try{
      return await this.message.getRecently(
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
  
  @Query(r => [Message<string,string>]) @UseGuards(GraphqlGuard) async fetchDetail(@Context() ctx, @Args('_id',OidPipe) _id:string){
    const user = new Types.ObjectId(ctx.req.user._id)

    try{
      return await this.message.getAll(
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

  @Mutation(r => Update) @UseGuards(GraphqlGuard) async updateMessage(@Context() ctx,@Args('_id',OidPipe) _id:string,@Args('groupId',OidPipe) gId:string){
    try{
      var update = await this.message.update<{sender:string},{read:boolean}>(
        {
          sender:_id
        },
        {
          read:true
        }
      )

      //await this.gateway.emit('updated',`${gId.toString()}/${_id.toString()}`,ctx.req.user._id)
      //await this.gateway.emit('history/updated',`history/${_id.toString()}`,ctx.req.user._id)

      return {
        modifiedCount:update.modifiedCount
      }
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
  @Field(r => Accept)
  accept:Accept
}

@ObjectType() class Update{
  @Field(r => Number)
  modifiedCount:Number
}
