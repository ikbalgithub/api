import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { User } from './user.model';
import { UserService } from './user.service';
import { GraphQLError } from 'graphql';

@Resolver() export class UserResolver {
  constructor(private readonly userService:UserService) {}

  @Query(r => [User]) async findByUsername(@Args('u') u:string){
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