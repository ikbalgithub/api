import { Body, Controller, Logger, Post, Request, Res, UseGuards } from '@nestjs/common';
import { IsNotEmpty } from 'class-validator';
import { Types } from 'mongoose';
import { AuthGuard } from 'src/guards/auth.guard';
import { FriendService } from 'src/services/friend/friend.service';

@Controller('friend') export class FriendController {
  @Post('/request') 
  @UseGuards(AuthGuard) 
  async request(@Body() dto:RequestDto,@Request() request,@Res() response){
    var _id = new Types.ObjectId(request.user._id)

    try{
      var result = await this.friendSvc.request(
        {
          from:_id,
          to:dto.to
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

  constructor(private friendSvc:FriendService){
    // inject friend service
  }
}

class RequestDto{
  @IsNotEmpty() to:Types.ObjectId
}