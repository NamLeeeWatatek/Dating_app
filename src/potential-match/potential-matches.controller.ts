import { NullableType } from './../utils/types/nullable.type';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { Roles } from '../roles/roles.decorator';
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../roles/roles.guard';
import { User } from '../users/domain/user';
import { RoleEnum } from '../roles/roles.enum';
import { PotentialMatch } from './domain/potential-match';
import { PotentialMatchService } from './potential-matches.service';
import { CreatePotentialMatchDto } from './dto/create-potential-match.dto';

@ApiBearerAuth()
@Roles(RoleEnum.admin, RoleEnum.user)
@UseGuards(AuthGuard('jwt'), RolesGuard)
@ApiTags('Potential Matches')
@Controller({
  path: 'users/potential-matches',
  version: '1',
})
export class PotentialMatchController {
  constructor(private readonly potentialMatchService: PotentialMatchService) {}

  @ApiCreatedResponse({
    type: PotentialMatch,
  })
  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() data: CreatePotentialMatchDto): Promise<PotentialMatch> {
    return this.potentialMatchService.createPotentialMatch(data);
  }

  @ApiOkResponse({
    type: [PotentialMatch],
  })
  @Get('user/:userId')
  @HttpCode(HttpStatus.OK)
  @ApiParam({
    name: 'userId',
    type: String,
    required: true,
  })
  findByUserId(
    @Param('userId') userId: User['id'],
  ): Promise<NullableType<PotentialMatch[]>> {
    return this.potentialMatchService.getPotentialMatches(userId);
  }

  @ApiOkResponse({
    type: PotentialMatch,
  })
  @Get('user/:userId/match/:matchId')
  @HttpCode(HttpStatus.OK)
  @ApiParam({ name: 'userId', type: String, required: true })
  @ApiParam({ name: 'matchId', type: String, required: true })
  findByUserPair(
    @Param('userId') userId: string,
    @Param('matchId') matchId: string,
  ): Promise<PotentialMatch | null> {
    return this.potentialMatchService.findByUserPair(userId, matchId);
  }

  @Delete(':id')
  @ApiParam({ name: 'id', type: String, required: true })
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string): Promise<void> {
    return this.potentialMatchService.removePotentialMatch(id);
  }

  @Delete('user/:userId/match/:matchId')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiParam({ name: 'userId', type: String, required: true })
  @ApiParam({ name: 'matchId', type: String, required: true })
  removeByUserPair(
    @Param('userId') userId: string,
    @Param('matchId') matchId: string,
  ): Promise<void> {
    return this.potentialMatchService.removeByUserPair(userId, matchId);
  }
}
