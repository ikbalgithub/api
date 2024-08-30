import { Body, Controller, Logger, Post, Request, Res, UseGuards } from '@nestjs/common';
import { IsNotEmpty } from 'class-validator';
import { Types } from 'mongoose';
import { AuthGuard } from 'src/guards/auth.guard';
import { FriendService } from 'src/services/friend/friend.service';

class RequestDto{
  @IsNotEmpty() to:string
}

@Controller('friend') export class FriendController {
  @Post('/request') 
  @UseGuards(AuthGuard) 
  async request(@Body() dto:RequestDto,@Request() request,@Res() response){
    try{
      var result = await this.friendSvc.request(
        {
          from:new Types.ObjectId(
            request.user._id
          ),
          to:new Types.ObjectId(
            dto.to
          )
        }
      )

      response.status(200).send(
        result
      )
    }
    catch(error:any){
      new Logger('ERROR').error(error.message)
      response.status(500).send(error.message)
    }
  }

  @Post('/accept')
  @UseGuards(AuthGuard)
  async accepts(@Body() dto:any,@Request() request,@Res() response){
    try{
      var [user1] = await this.friendSvc.setAsAccepted(
        new Types.ObjectId(request.user._id),
        new Types.ObjectId(dto._id)
      )

      var [user2] = await this.friendSvc.setAsAccepted(
        new Types.ObjectId(dto._id),
        new Types.ObjectId(request.user._id)
      )

      var result = await this.friendSvc.accept(
        [
          {
            _id:new Types.ObjectId(
              request.user._id
            ),
            list:user1.list
          },
          {
            _id:new Types.ObjectId(
              dto._id,
            ),
            list:user2.list
          }
        ]
      )

      response.status(200).send(
        result
      )
    }
    catch(err:any){
      new Logger('ERROR').error(err.message)
      response.status(500).send(err.message)
    }
  }

  constructor(private friendSvc:FriendService){
    // inject friend service
  }
}