import { Common } from '../../../index.d'
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

  createLog({delay,status,url,method}:Common.LogMessage){
    var log = `${status} [${method}] ${url} - ${delay}`
    
    new Logger('HTTP').log(
      `${log} ms`
    )
  }
}