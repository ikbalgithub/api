import { Response } from 'express'
import { isEqual,includes } from 'lodash'
import { Model,Types } from 'mongoose';
import { Common,Result } from '../../../index.d'
import { AuthGuard } from '../../guards/auth.guard'
import { Controller } from '@nestjs/common';
import { LoginDto } from '../../dtos/login.dto'
import { UserService } from '../../services/user/user.service'
import { ProfileService } from '../../services/profile/profile.service'
import { MessageService } from '../../services/message/message.service'
import { CommonService } from '../../services/common/common.service'
import { Post,Body,Res,Logger,Get,Param,UseGuards,Request } from '@nestjs/common';

@Controller('user') export class UserController {

  @Post('login') async login(@Body() dto:LoginDto,@Res() response:Response):Promise<void>{
    try{
      let [result] = await this.userSvc.login(dto)
 
      let authorization:string = await this.commonSvc.getJwt<Common.Jwt>(
        {
          _id:result._id.toString()
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

  @Get('search/:q') @UseGuards(AuthGuard) async search(@Request() request,@Res() response:Response,@Param('q') q):Promise<void>{
    var _id = new Types.ObjectId(request.user._id)

    try{
     
      var profiles = await this.profileSvc.find(q,_id)
      var _ids = profiles.map(({usersRef}) => usersRef)
      var messages = await this.messageSvc.recently(
        _ids,_id
      )

      var result = profiles.map((profile) => {
        var [filter] = messages.filter(m => {
          var isEqual1 = isEqual(
            m.sender,
            profile.usersRef
          )

          var isEqual2 = isEqual(
            m.accept,
            profile.usersRef
          )

          return isEqual1 || isEqual2
        })

        if(filter){
          return {
            ...profile,
            message:filter
          }
        }
        else{
          return profile
        }
      })

      response.send(
        result
      )
    }
    catch(err){
      new Logger('Error').error(err.message)
      response.status(500).send(err.message)
    }
  }

  constructor(
    private userSvc:UserService,
    private profileSvc:ProfileService,
    private messageSvc:MessageService,
    private commonSvc:CommonService
  ){}

}

