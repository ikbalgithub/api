import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { User,TestX } from './user.model';
import { UserService } from './user.service';
import { GraphQLError } from 'graphql';
import { Profile } from 'src/schemas/profile.schema';

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