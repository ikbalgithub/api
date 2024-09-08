import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';


@Injectable() export class GraphqlGuard implements CanActivate {
  
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToRpc().getContext()
    const secret = process.env.JWT_SECRET_KEY
    console.log(request)
    const headers = request.headers
    const authorization = headers?.authorization
    var restricted:boolean = false

    if(!authorization){
      restricted = true
    }

    else{
      try{
        request['user'] = await this.jwt.verifyAsync(
          authorization.split(' ')[1],{
            secret
          }
        )
      }
      catch{
        restricted = true
      }
    }

    return !restricted
  }

  constructor(private jwt: JwtService){
    // inject jwt service
  }

}
