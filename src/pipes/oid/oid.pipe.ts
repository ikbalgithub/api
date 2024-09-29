import { Types } from 'mongoose'
import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';

@Injectable() export class OidPipe implements PipeTransform {
  transform(v:string,args:ArgumentMetadata):Types.ObjectId{
    return new Types.ObjectId(v);
  }
}
