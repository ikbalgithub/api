import { Args, Context, Field, Int, Mutation, ObjectType, Query, Resolver } from '@nestjs/graphql';
import { User } from './user.model';
import { UserService } from './user.service';
import { GraphQLError } from 'graphql';
import { UseGuards } from '@nestjs/common';
import { GraphqlGuard } from 'src/guards/graphql/graphql.guard';
import { Types } from 'mongoose';
import { Profile } from 'src/profile/profile.model';
import { Message } from 'src/message/message.model';
import { MessageService } from 'src/services/message/message.service';

@Resolver() export class UserResolver {
  constructor(private readonly userService:UserService) {}

  @Query(r => [Search]) @UseGuards(GraphqlGuard) async findByUsername(@Context() ctx, @Args('u') u:string){
    try{
      return await this.userService.findByUsername(
        u,new Types.ObjectId(ctx.req.user._id)
      )
    }
    catch(err:any){
      throw new GraphQLError(err.message)
    }
  }
}

@ObjectType() class Search extends User{
  @Field(r => Profile,{nullable:false})
  profile:Profile
  @Field(r => [Message],{nullable:true})
  messages:Message[]
}


