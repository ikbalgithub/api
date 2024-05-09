import { Types } from 'mongoose'
import { OauthDto } from '../../dtos/oauth.dto'
import { OAuth2Client } from 'google-auth-library'
import { Controller,Post,Res,Query,Body,Param} from '@nestjs/common';
import { UserService } from '../../services/user/user.service'
import { Common } from '../../../index.d'
import { ProfileService } from '../../services/profile/profile.service'
import { CommonService } from '../../services/common/common.service'

@Controller('oauth') export class OauthController{
  
  constructor(private user:UserService,private common:CommonService,private profile:ProfileService){}
  
  @Post('') async findOrCreate(@Body() dto:OauthDto,@Res() response):Promise<void>{
    try{
      var [user] = await this.user.findByOauthReference(dto.uid)
      
      var authorization = await this.common.getJwt<Common.Jwt>(
        {
          _id:user?._id.toString() ?? ''
        }
      )
      if(user) response.send(
        {
          authorization,
          ...user,
          username:user.username
        }
      )

      if(!user){
        var username = `user${Date.now()}`
        var newUser = await this.user.new({
          _id:new Types.ObjectId(),
          oauthReference:dto.uid,
          username
        }) 

        authorization = await this.common.getJwt<Common.Jwt>(
          {
            _id:newUser._id.toString()
          }
        )

        var newProfile = await this.profile.new({
          profileImage:dto.profile.profileImage,
          firstName:dto.profile.firstName,
          surname:dto.profile.surname,
          usersRef:newUser._id,
          _id:new Types.ObjectId()
        })

        response.send({
          _id:newUser._id,
          profile:newProfile,
          authorization,
          username
        })
      }
    }
    catch(e){
      console.log(e)
    }
  }
}


