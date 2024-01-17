import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable() export class CommonService {
  
  constructor(private jwtService:JwtService){}

  getJwt<Token>(payload:Token):Promise<string>{
  	return this.jwtService.signAsync(
      payload as Object
  	)
  }

}
