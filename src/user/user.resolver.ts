import { Args, Context, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { User } from './user.model';
import { UserService } from './user.service';
import { GraphQLError } from 'graphql';
import { UseGuards } from '@nestjs/common';
import { GraphqlGuard } from 'src/guards/graphql/graphql.guard';

@Resolver() export class UserResolver {
  constructor(private readonly userService:UserService) {}

  @Query(r => [User]) @UseGuards(GraphqlGuard) async findByUsername(@Context() ctx, @Args('u') u:string){
    console.log(
      {
        ...ctx.req.user
      }
    )
    
    try{
      return await this.userService.findByUsername(
        u
      )
    }
    catch(err:any){
      throw new GraphQLError(err.message)
    }
  }
}