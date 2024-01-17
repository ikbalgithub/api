import { LogMessage } from '../../../index.d'
import { Request,Response,NextFunction } from 'express'
import { Injectable, NestMiddleware,Logger } from '@nestjs/common';

@Injectable() export class LoggerMiddleware implements NestMiddleware {  
  use(request:Request,response:Response,next:NextFunction){
    var requestTime = Date.now()

    response.on('finish',() => this.createLog({
      delay:Date.now() - requestTime,
      status:response.statusCode,
      url:request.originalUrl,
      method:request.method
    }))

    next();
  
  }

  createLog({delay,status,url,method}:LogMessage){
    var log:string = `${status} [${method}]`

    log = `${log} ${url} - ${delay} ms`

    new Logger('HTTP').log(
      log
    )
  }
}