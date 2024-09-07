import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { User } from './user.model';
import { UserService } from './user.service';

@Resolver(of => User) export class UserResolver {
  constructor(private service:UserService) {}

  @Query(r => User) async findByUsername(){
    try{
      var result = await this.service.findByUsername(
        'u1'
      )

      return result
    }
    catch(e:any){
      console.log(e.message)
      return e.message
    }
  }

  @Query(returns => User) async example(){
    return {
      id:'1234'
    }
  }

  @Q
}