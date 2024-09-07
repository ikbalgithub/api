import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { User } from './user.model';
import { UserService } from './user.service';

@Resolver(of => User) export class UserResolver {
  constructor(private service:UserService) {}

  @Query(returns => User) async example(){
    return {
      id:'1234'
    }
  }
}