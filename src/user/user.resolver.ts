import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { User } from './user.model';
import { UserService } from './user.service';

@Resolver(r => User) export class UserResolver {
  constructor(private service:UserService) {}

  @Query(r => [User]) async findByUsername(){
    try{
      var r = await this.service.findByUsername(
        'u1'
      )

      return r
    }
    catch(err:any){
      console.log(err.message)
      throw new Error('Terjadi kesalahan saat mengambil data');
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
      return err.message
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