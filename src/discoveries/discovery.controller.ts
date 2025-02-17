import { Controller, Get, Query, Request, UseGuards } from '@nestjs/common';
import { DiscoveryService } from './discovery.service';
import {
  FilterDiscoveryDto,
  QueryDiscoveryDto,
} from './dto/query-discovery.dto';
import { ApiBearerAuth, ApiQuery, ApiTags } from '@nestjs/swagger';
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
  @ApiQuery({
    name: 'filter',
    type: FilterDiscoveryDto,
  })
  @Get('search')
  async findMatchingUsers(@Query() query: QueryDiscoveryDto, @Request() req) {
    const { page = 1, limit = 10, sort, filter } = query;
    const paginationOptions = { page, limit };
    const userId = req.user.id;
    console.log(query);
    const result = await this.discoveryService.findMatchingUsers({
      userId,
      filterOptions: filter,
      sortOptions: sort,
      paginationOptions,
    });

    return {
      data: result.data,
      totalItems: result.totalItems,
    };
  }
}
