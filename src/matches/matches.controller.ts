import {
  Controller,
  Get,
  Post,
  Param,
  Delete,
  UseGuards,
  HttpStatus,
  HttpCode,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { Roles } from '../roles/roles.decorator';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../roles/roles.guard';
import { RoleEnum } from '../roles/roles.enum';
import { MatchService } from './matches.service';
import { Match } from './domain/match';

@ApiBearerAuth()
@Roles(RoleEnum.user, RoleEnum.admin)
@UseGuards(AuthGuard('jwt'), RolesGuard)
@ApiTags('Matches')
@Controller({
  path: 'matches',
  version: '1',
})
export class MatchController {
  constructor(private readonly matchService: MatchService) {}

  @ApiCreatedResponse({
    type: Match,
    description: 'Creates a match between two users.',
  })
  @ApiOperation({
    summary: 'Create a match',
    description: 'Creates a match when two users like each other.',
  })
  @Post(':userId/:matchedUserId')
  @HttpCode(HttpStatus.CREATED)
  createMatch(
    @Param('userId') userId: string,
    @Param('matchedUserId') matchedUserId: string,
  ): Promise<Match> {
    return this.matchService.createMatch(userId, matchedUserId);
  }

  @ApiOkResponse({
    type: [Match],
    description: 'Returns all matches of a user.',
  })
  @ApiOperation({
    summary: 'Get all matches of a user',
  })
  @Get(':userId')
  @HttpCode(HttpStatus.OK)
  getUserMatches(@Param('userId') userId: string): Promise<Match[]> {
    return this.matchService.getUserMatches(userId);
  }

  @ApiNoContentResponse({
    description: 'Deletes a match between two users.',
  })
  @ApiOperation({
    summary: 'Delete a match',
  })
  @Delete(':userId/:matchedUserId')
  @HttpCode(HttpStatus.NO_CONTENT)
  deleteMatch(
    @Param('userId') userId: string,
    @Param('matchedUserId') matchedUserId: string,
  ): Promise<void> {
    return this.matchService.deleteMatch(userId, matchedUserId);
  }
}
