import { Response } from 'express'
import { Jwt } from '../../../index.d'
import { Controller } from '@nestjs/common';
import { LoginDto } from '../../dtos/login.dto'
import { UserService } from '../../services/user/user.service'
import { CommonService } from '../../services/common/common.service'
import { Post,Body,Res,Logger } from '@nestjs/common';


@Controller('user') export class UserController {

  @Post('login') async login(@Body() dto:LoginDto,@Res() response:Response):Promise<void>{
    try{
      let [result] = await this.userSvc.login(dto)

      let authorization:string = await this.commonSvc.getJwt<Jwt>(
        {
          _id:result?._id
        }
      )

      if(result) response.send(
        [
          {
            authorization,
            ...result
          }
        ]
      )

      if(!result) response.send(
        []
      )
    }
    catch(err){
      new Logger('Error').error(err.message)
      response.status(500).send(err.message)
    }
  }

  constructor(
    private userSvc:UserService,
    private commonSvc:CommonService
  ){}

}

