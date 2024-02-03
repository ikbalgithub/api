import { Types } from 'mongoose'
import { Message,Last_Message } from '../../schemas/message.schema'
import { MessageService } from '../../services/message/message.service'
import { AuthGuard } from '../../guards/auth.guard'
import { MessageDto } from '../../dtos/message.dto'
import { MessageUpdateRead } from '../../dtos/message-update-read.dto'
import { EventsGateway } from '../../gateways/events/events.gateway'
import { Controller,Get,Body,UseGuards,Request,Param,Res,Logger,Post,Put } from '@nestjs/common';

@Controller('message') export class MessageController {

  @Get('all/:_id') @UseGuards(AuthGuard) async getAll(@Request() request,@Res()response,@Param('_id') _id):Promise<void>{
    if(!Types.ObjectId.isValid(request.user._id)) response.status(500).send('internal server error')
    
    var [user,otherUser] = [request.user._id,_id].map(user => new Types.ObjectId(user))

    try{
      var result = await this.message.getAll<{sender:Types.ObjectId,accept:Types.ObjectId}>(
        [
          {
            sender: user,
            accept: otherUser,
          },
          {
            sender:otherUser,
            accept:user,
          } 
        ]
      )
      response.send(
        result
      )
    }
    catch(error:any){
      new Logger('ERROR').error(error.message)
      response.status(500).send(error.message)
    }


  }
  
  @Get('recently') @UseGuards(AuthGuard) async getRecently(@Request()request,@Res() response):Promise<void>{
    try{
      var result = await this.message.getRecently<{sender:Types.ObjectId,accept:Types.ObjectId}>(
        {
          sender:new Types.ObjectId(
            request.user._id
          ),
          accept:new Types.ObjectId(
            request.user._id
          )
        }
      )
      
      response.send(
        result
      )
    }
    catch(error:any){
      new Logger('Error').error(error.message)
      response.status(500).send(error.message)
    }
    
  }

  @Post('') @UseGuards(AuthGuard) async new(@Body() dto:MessageDto,@Request() request,@Res() response):Promise<void>{
    if(!Types.ObjectId.isValid(dto.accept)) response.status(500).send("internal server error")
    if(!Types.ObjectId.isValid(dto.groupId)) response.status(500).send("internal server error")
    if(!Types.ObjectId.isValid(dto._id)) response.status(500).send("internal server error")  

    var [sender,_id,accept,groupId] = [request.user._id,dto._id,dto.accept,dto.groupId].map((objectId) => {
      return new Types.ObjectId(
        objectId
      )
    })

    try{
      var result = await this.message.new({
        ...dto,
        _id,
        sender,
        accept,
        groupId,
        contentType:'',
        description:'',
        read:false,
      })
      
      var [populated] = await this.message.populate(
        result._id
      )
      
      this.gateway.newMessage<Message>(result,dto.accept)
      this.gateway.newMessage<Message>(result,`${dto.groupId}/${dto.accept}`)
      this.gateway.message<Omit<Last_Message,"unreadCounter">>(
        populated,dto.accept
      )

      response.send(
        result
      )
    }
    catch(err){
      new Logger('Error').error(err.message)
      response.status(500).send(err.message)
    }
  }

  @Put('') async updateOnRead(@Body() dto:MessageUpdateRead, @Res() response):Promise<void>{
    if(!Types.ObjectId.isValid(dto._id)) response.status(500).send(
      "internal server error"
    )

    try{
      var result = await this.message.updateOnRead(
        new Types.ObjectId(dto._id)
      )
      this.gateway.updated(
        result._id
      )
      response.send(
        result
      )
    }
    catch(err){
      new Logger('Error').error(err.message)
      response.status(500).send(err.message)
    }
  }



  constructor(private message:MessageService,private gateway:EventsGateway){
    // inject message service
    // inject events gateway
  }
}
