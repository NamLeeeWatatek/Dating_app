import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
  HttpStatus,
  HttpCode,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { Roles } from '../roles/roles.decorator';
import { RoleEnum } from '../roles/roles.enum';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../roles/roles.guard';

import { InteractionsService } from './interactions.service';
import { CreateInteractionDto } from './dto/create-interation.dto';
import { UpdateInteractionDto } from './dto/update-interation.dto';
import { QueryInteractionDto } from './dto/query-interation.dto';
import { Interaction } from './domain/interaction';
import { NullableType } from '../utils/types/nullable.type';
import { InfinityPaginationResponse } from '../utils/dto/infinity-pagination-response.dto';
import { infinityPagination } from '../utils/infinity-pagination';
import { CacheInterceptor, CacheTTL } from '@nestjs/cache-manager';

@ApiBearerAuth()
@Roles(RoleEnum.admin, RoleEnum.user)
@UseGuards(AuthGuard('jwt'), RolesGuard)
@ApiTags('Interactions')
@Controller({
  path: 'interactions',
  version: '1',
})
export class InteractionController {
  constructor(private readonly interactionService: InteractionsService) {}
  @UseInterceptors(CacheInterceptor)
  @ApiCreatedResponse({
    type: Interaction,
  })
  @CacheTTL(60 * 1000)
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Body() createInteractionDto: CreateInteractionDto,
  ): Promise<Interaction> {
    return this.interactionService.create(createInteractionDto);
  }

  @ApiOkResponse({
    type: InfinityPaginationResponse(Interaction),
  })
  @Get()
  @HttpCode(HttpStatus.OK)
  async findAll(@Query() query: QueryInteractionDto) {
    const page = query?.page ?? 1;
    let limit = query?.limit ?? 10;
    if (limit > 50) {
      limit = 50;
    }

    const { data, totalItems } =
      await this.interactionService.findManyWithPagination({
        filterOptions: query?.filters,
        sortOptions: query?.sort,
        paginationOptions: {
          page,
          limit,
        },
      });

    return infinityPagination(data, totalItems, { page, limit });
  }

  @ApiOkResponse({
    type: Interaction,
  })
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiParam({
    name: 'id',
    type: String,
    required: true,
  })
  async findOne(
    @Param('id') id: Interaction['id'],
  ): Promise<NullableType<Interaction>> {
    return this.interactionService.findById(id);
  }

  @ApiOkResponse({
    type: [Interaction],
  })
  @Get('user/:userId')
  @HttpCode(HttpStatus.OK)
  @ApiParam({
    name: 'userId',
    type: String,
    required: true,
  })
  async findByUserId(@Param('userId') userId: string): Promise<Interaction[]> {
    return this.interactionService.findByUserId(userId);
  }

  @ApiOkResponse({
    type: InfinityPaginationResponse(Interaction),
  })
  @Get('target/:targetUserId')
  @HttpCode(HttpStatus.OK)
  @ApiParam({
    name: 'targetUserId',
    type: String,
    required: true,
  })
  async findInteractionsByTargetUser(
    @Param('targetUserId') targetUserId: string,
    @Query() query: QueryInteractionDto,
  ) {
    const paginationOptions = {
      page: query.page ?? 1,
      limit: query.limit ?? 10,
    };

    const { data, totalItems } =
      await this.interactionService.findInteractionsByTargetUser(
        targetUserId,
        paginationOptions,
      );

    return infinityPagination(data, totalItems, paginationOptions);
  }

  @ApiOkResponse({
    type: Boolean,
  })
  @Get('match/:userId1/:userId2')
  @HttpCode(HttpStatus.OK)
  async checkMatch(
    @Param('userId1') userId1: string,
    @Param('userId2') userId2: string,
  ): Promise<boolean> {
    return this.interactionService.checkMatch(userId1, userId2);
  }

  @ApiOkResponse({
    type: Interaction,
  })
  @Post('block/:blockerId/:blockedId')
  @HttpCode(HttpStatus.CREATED)
  @ApiParam({ name: 'blockerId', type: String, required: true })
  @ApiParam({ name: 'blockedId', type: String, required: true })
  async blockUser(
    @Param('blockerId') blockerId: string,
    @Param('blockedId') blockedId: string,
  ): Promise<Interaction> {
    return this.interactionService.blockUser(blockerId, blockedId);
  }

  @Post('unblock/:blockerId/:blockedId')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiParam({ name: 'blockerId', type: String, required: true })
  @ApiParam({ name: 'blockedId', type: String, required: true })
  async unblockUser(
    @Param('blockerId') blockerId: string,
    @Param('blockedId') blockedId: string,
  ): Promise<void> {
    return this.interactionService.unblockUser(blockerId, blockedId);
  }

  @ApiOkResponse({
    type: Boolean,
  })
  @Get('status/:userId1/:userId2')
  @HttpCode(HttpStatus.OK)
  async checkInteractionStatus(
    @Param('userId1') userId1: string,
    @Param('userId2') userId2: string,
  ): Promise<NullableType<Interaction>> {
    return this.interactionService.checkInteractionStatus(userId1, userId2);
  }

  @ApiOkResponse({
    type: InfinityPaginationResponse(Interaction),
  })
  @Get('sent-likes/:userId')
  @HttpCode(HttpStatus.OK)
  async getSentLikes(
    @Param('userId') userId: string,
    @Query() query: QueryInteractionDto,
  ) {
    return this.interactionService.getSentLikes(userId, {
      page: query.page ?? 1,
      limit: query.limit ?? 10,
    });
  }

  @ApiOkResponse({
    type: InfinityPaginationResponse(Interaction),
  })
  @Get('received-likes/:userId')
  @HttpCode(HttpStatus.OK)
  async getReceivedLikes(
    @Param('userId') userId: string,
    @Query() query: QueryInteractionDto,
  ) {
    return this.interactionService.getReceivedLikes(userId, {
      page: query.page ?? 1,
      limit: query.limit ?? 10,
    });
  }

  @ApiOkResponse({
    type: Interaction,
  })
  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @ApiParam({
    name: 'id',
    type: String,
    required: true,
  })
  async update(
    @Param('id') id: Interaction['id'],
    @Body() updateInteractionDto: UpdateInteractionDto,
  ): Promise<Interaction | null> {
    return this.interactionService.update(id, updateInteractionDto);
  }

  @Delete(':id')
  @ApiParam({
    name: 'id',
    type: String,
    required: true,
  })
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: Interaction['id']): Promise<void> {
    return this.interactionService.remove(id);
  }
}
