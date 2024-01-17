import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Observable } from 'rxjs';
import { JwtService } from '@nestjs/jwt';


@Injectable() export class AuthGuard implements CanActivate {
  
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const http = context.switchToHttp()
    const request = http.getRequest()
    const secret = process.env.JWT_SECRET_KEY
    const headers = request.headers
    const authorization = headers.authorization
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
