import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { User } from './user.model';

@Resolver(of => User) export class UserResolver {
  constructor() {}

  @Query(returns => User) async test(){
    return {
      id:'1234'
    }
  }
}
