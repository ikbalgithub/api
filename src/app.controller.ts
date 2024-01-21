import { Controller,Get,UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import { AuthGuard } from './guards/auth.guard'

@Controller() export class AppController {
  @Get('') getMotherFucker():string{
    return 'hello motherfucker'
  }
}
