import { Types } from 'mongoose'
import { Profile } from '../../schemas/profile.schema'
import { AuthGuard } from '../../guards/auth.guard'
import { Controller,Body,Get,Put,Request,Res,UseGuards,Logger,Param } from '@nestjs/common';
import { ProfileUpdate } from '../../dtos/profile-update.dto'
import { ProfileService } from '../../services/profile/profile.service'

@Controller('profile') export class ProfileController {
  @Put('') @UseGuards(AuthGuard) async update(@Body() dto:ProfileUpdate,@Request() request, @Res() response):Promise<void>{
    var usersRef = new Types.ObjectId(request.user._id)
    var _id = new Types.ObjectId(dto._id)

    try{
      var result = await this.profileService.update({
        ...dto,
        usersRef,
        _id
      })

      response.send(
        result
      )
    }
    catch(e:any){
      new Logger('ERROR').error(e.message)
      response.status(500).send(e.message)
    }
  }

  @Get('/:_id') @UseGuards(AuthGuard) async findByRef(@Res() response, @Param('_id') _id){
    if(!Types.ObjectId.isValid(_id)) response.status(500).send('internal server error')

    try{
      var result = await this.profileService.findByRef(
        {
          usersRef:new Types.ObjectId(_id)
        }
      )

      response.send(
        result
      )
    }
    catch(err:any){
      new Logger('ERROR').error(err.message)
      response.status(500).send(err.message)
    }
  }

  constructor(private profileService:ProfileService){}
}
