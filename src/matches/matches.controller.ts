import {
  Controller,
  Get,
  Post,
  Param,
  Delete,
  UseGuards,
  HttpStatus,
  HttpCode,
  Query,
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
import { UserProfileDto } from '../user-profile/dto/user-profile.dto';
import { InfinityPaginationResponse } from '../utils/dto/infinity-pagination-response.dto';
import { QueryInteractionDto } from '../interactions/dto/query-interation.dto';

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
    type: InfinityPaginationResponse(UserProfileDto), // Cập nhật kiểu trả về có phân trang
  })
  @ApiOperation({
    summary: 'Get all matched users with their profile (paginated)',
  })
  @Get(':userId')
  @HttpCode(HttpStatus.OK)
  async getUserMatches(
    @Param('userId') userId: string,
    @Query() query: QueryInteractionDto, // Nhận page và limit từ query params
  ) {
    return this.matchService.getUserMatches(userId, query);
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
