import { Response } from 'express'
import { isEqual } from 'lodash'
import { Types } from 'mongoose';
import { Common } from '../../../index.d'
import { AuthGuard } from '../../guards/auth.guard'
import { Controller } from '@nestjs/common';
import { LoginDto } from '../../dtos/login.dto'
import { AccountUpdate } from '../../dtos/account-update.dto'
import { UserService } from '../../services/user/user.service'
import { ProfileService } from '../../services/profile/profile.service'
import { MessageService } from '../../services/message/message.service'
import { CommonService } from '../../services/common/common.service'
import { Post,Put,Body,Res,Logger,Get,Param,UseGuards,Request } from '@nestjs/common';

@Controller('user') export class UserController {

  @Put('update') @UseGuards(AuthGuard) async updateUsername(@Body() dto:AccountUpdate,@Request() request,@Res() response):Promise<void>{
    var _id = new Types.ObjectId(request.user._id)

    try{
      let result = await this.userSvc.update(
        _id,dto
      )

      response.send(
        dto
      )
    }
    catch(err:any){
      new Logger('Error').error(err.message)
      response.status(500).send(err.message)
    }
  }

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
      var [result] = await this.userSvc.findByUsername(q,_id)
      var [message] = await this.messageSvc.recently(
        result?.profile.usersRef,_id
      )

      if(result){
        if(message) response.status(200).send(
          [
            {
              ...result,
              message
            }
          ]
        )
        else{
          response.status(200).send(
            [result]
          )
        }
      }
      else{
        response.status(200).send(
          []
        )
      }
    }
    catch(err){
      new Logger('Error').error(err.message)
      response.status(500).send(err.message)
    }

    // try{
    //   var searchResult = await this.userSvc.findByUsername(q,_id)
    //   var profiles = searchResult.map(({profile,friends}) => profile[0])
    //   var _ids = profiles.map(({usersRef}) => usersRef)
      
    //   var messages = await this.messageSvc.recently(
    //     _ids,_id
    //   )


    //   var result = profiles.map((profile) => {
    //     var [filter] = messages.filter(m => {
    //       var isEqual1 = isEqual(
    //         m.sender as Types.ObjectId,
    //         profile.usersRef
    //       )

    //       var isEqual2 = isEqual(
    //         m.accept as Types.ObjectId,
    //         profile.usersRef
    //       )

    //       return isEqual1 || isEqual2
    //     })

    //     if(filter){
    //       return {
    //         ...profile,
    //         message:filter
    //       }
    //     }
    //     else{
    //       return profile
    //     }
    //   })

    //   response.send(
    //     result
    //   )
    // }
    // catch(err){
    //   new Logger('Error').error(err.message)
    //   response.status(500).send(err.message)
    // }
  }

  constructor(
    private userSvc:UserService,
    private profileSvc:ProfileService,
    private messageSvc:MessageService,
    private commonSvc:CommonService
  ){}

}

