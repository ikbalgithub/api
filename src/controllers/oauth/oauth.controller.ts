import { Types } from 'mongoose'
import { OAuth2Client } from 'google-auth-library'
import { Controller,Get,Res,Query } from '@nestjs/common';
import { UserService } from '../../services/user/user.service'
import { Common } from '../../../index.d'
import { CommonService } from '../../services/common/common.service'


@Controller('oauth') export class OauthController {
  profile = `https://www.googleapis.com/auth/userinfo.profile`
  email = `https://www.googleapis.com/auth/userinfo.email`
  info = 'https://www.googleapis.com/oauth2/v1/userinfo?alt=json'


  oAuth2Client = new OAuth2Client(
    process.env.GOOGLE_MESSENGER_CLIENT_ID, 
    process.env.GOOGLE_MESSENGER_CLIENT_SECRET, 
    process.env.MESSENGER_REDIRECT
  )

  @Get('') generateAuthUri(@Res() response){
    var url = this.oAuth2Client.generateAuthUrl(
      {
      	access_type:'offline',
        scope:[this.email,this.profile]
      }
    )

    response.send(
      url
    )
  }

  @Get('callback') async callback(@Query('code') code,@Res() response):Promise<void>{
    var oauth2ClientToken = await this.oAuth2Client.getToken(
      code
    )
     
    var credential = this.oAuth2Client.setCredentials(
      oauth2ClientToken.tokens
    )
    
    try{
      var oauthInfo:any = await this.oAuth2Client.request({
        url:this.info
      })

      var [user] = await this.userSvc.findByOauthReference(
        oauthInfo.data.id
      )

      let authorization = await this.commonSvc.getJwt<Common.Jwt>(
        {
          _id:user._id.toString()
        }
      )

      if(user){
        response.send([
          {
            authorization,
            ...user
          }
        ])
      }
      else{
        await this.userSvc.newAccountByGoogleInfo({
          _id:new Types.ObjectId(),
          oauthReference:oauthInfo.data.id
        })
      }
    }
    catch(err){
      console.log(err.message)
    }
  }

  constructor(
    private userSvc:UserService,
    private commonSvc:CommonService
  ){}
}
