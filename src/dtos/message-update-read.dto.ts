import { IsNotEmpty } from "class-validator";

export class MessageUpdateRead{
  @IsNotEmpty() groupId:string
  @IsNotEmpty() _id:string
}