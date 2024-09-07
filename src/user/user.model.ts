import { Field, ID, ObjectType, Int } from '@nestjs/graphql';

@ObjectType() export class User {
  @Field((type) => ID)
  id: string
}