import { Args, Context, Field, Int, Mutation, ObjectType, Query, Resolver } from '@nestjs/graphql';
import { User } from './user.model';
import { UserService } from './user.service';
import { GraphQLError } from 'graphql';
import { UseGuards } from '@nestjs/common';
import { GraphqlGuard } from 'src/guards/graphql/graphql.guard';
import { Types } from 'mongoose';
import { Profile } from 'src/profile/profile.model';
import { Message } from 'src/message/message.model';
import { MessageService } from 'src/message/message.service'

@Resolver() export class UserResolver {
  constructor(private readonly userService:UserService,private readonly messageService:MessageService) {}

  @Query(r => [U]) @UseGuards(GraphqlGuard) async findByUsername(@Context() ctx, @Args('u') u:string){
    try{
      var _id = new Types.ObjectId(ctx.req.user._id)
      var result =  await this.userService.findByUsername(u,_id)
      var references = result.map(({profile}) => profile.usersRef)
      var messages = await this.messageService.getLast(references,_id)

      return result.map(({profile,...rest}) => {
        var [filter] = messages.filter(message => {
          var eq1 = _id.equals(
            message.sender
          )

          var eq2 = _id.equals(
            message.accept
          )

          return eq1 || eq2
        })

        return {
          ...rest,
          profile,
          message:filter
        }
      })
    }
    catch(err:any){
      throw new GraphQLError(err.message)
    }
  }
}

@ObjectType() class Last extends Message<Types.ObjectId,Types.ObjectId>{}

@ObjectType() class U extends User{
  @Field(r => Profile,{nullable:false})
  profile:Profile
  @Field(r => Last,{nullable:true})
  message:Last
}


