import { IsNotEmpty } from "class-validator";

export class ProfileUpdate{
  @IsNotEmpty() profileImage:string
  @IsNotEmpty() firstName:string
  @IsNotEmpty() surname:string
  @IsNotEmpty() _id:string
}