import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { User } from './user.model';
import { UserService } from './user.service';
import { GraphQLError } from 'graphql';

@Resolver(r => [User]) export class UserResolver {
  constructor(private service:UserService) {}

  @Query(r => [User]) async findByUsername(){
    try{
      var r = await this.service.findByUsername(
        'u1'
      )

      return r ? r : []
    }
    catch(err:any){
      throw new GraphQLError(err.message)
    }
  }

  @Query(r => User) async test(){
    try{
      var r = await promiseTest(
        false
      )

      return r
    }
    catch(err:any){
      throw new Error(err.message)
    }
  }
}

function promiseTest(testValue:boolean){
  return new Promise((resolve,reject) => {
    if(testValue) resolve(
      {
        _id:'1234'
      }
    )
    if(!testValue) reject(
      'test error'
    )
  })
}