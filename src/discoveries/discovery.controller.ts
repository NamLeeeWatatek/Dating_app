import { Controller, Get, Query, Request, UseGuards } from '@nestjs/common';
import { DiscoveryService } from './discovery.service';
import { QueryDiscoveryDto } from './dto/query-discovery.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Roles } from '../roles/roles.decorator';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../roles/roles.guard';
import { RoleEnum } from '../roles/roles.enum';

@ApiBearerAuth()
@Roles(RoleEnum.admin, RoleEnum.user)
@UseGuards(AuthGuard('jwt'), RolesGuard)
@ApiTags('discovery')
@Controller({
  path: 'discovery',
  version: '1',
})
export class DiscoveryController {
  constructor(private readonly discoveryService: DiscoveryService) {}

  @Get('search')
  async findMatchingUsers(@Query() query: QueryDiscoveryDto, @Request() req) {
    const { page = 1, limit = 10, ageRange, distanceRange } = query;
    const paginationOptions = { page, limit };
    const userId = req.user.id;
    if (!userId || !userId) {
      throw new Error('User or user id is undefined');
    }
    console.log(query);
    const result = await this.discoveryService.findMatchingUsers({
      userId,
      filterOptions: { ageRange, distanceRange },
      paginationOptions,
    });

    return {
      data: result.data,
      totalItems: result.totalItems,
    };
  }
}
