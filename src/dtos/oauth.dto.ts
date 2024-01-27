import { IsNotEmpty } from 'class-validator'
import { Profile } from '../schemas/profile.schema'

export class OauthDto{
  @IsNotEmpty() profile:Omit<Profile,"_id|usersRef">
  @IsNotEmpty() uid:string
}