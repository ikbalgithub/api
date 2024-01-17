import { IsNotEmpty } from "class-validator";

export class MessageUpdateRead{
  @IsNotEmpty() _id:string
}