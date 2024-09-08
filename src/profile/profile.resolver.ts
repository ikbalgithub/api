import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Profile } from './profile.model';
import { ProfileService } from './profile.service';
import { GraphQLError } from 'graphql';

@Resolver() export class ProfileResolver {
  constructor(private readonly profileService:ProfileService) {}

}