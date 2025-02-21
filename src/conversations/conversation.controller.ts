import {
  Controller,
  Get,
  Delete,
  HttpCode,
  HttpStatus,
  Query,
  Param,
} from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ConversationService } from './conversation.service';
import {
  InfinityPaginationResponse,
  InfinityPaginationResponseDto,
} from '../utils/dto/infinity-pagination-response.dto';
import { Conversation } from './domain/conversation';
import { QueryConversationDto } from './dto/query-message.dto';
import { ConversationDto } from './dto/conversation.dto';
import { infinityPagination } from '../utils/infinity-pagination';
import { FindConversationQueryDto } from './dto/find-conversation.dto';

@ApiTags('Conversations')
@Controller({
  path: 'conversations',
  version: '1',
})
export class ConversationController {
  constructor(private readonly conversationService: ConversationService) {}

  @ApiOkResponse({
    type: InfinityPaginationResponse(Conversation),
  })
  @ApiOperation({ summary: 'Get conversations by user ID with pagination' })
  @Get()
  @HttpCode(HttpStatus.OK)
  async findManyWithPaginationByUserId(
    @Query() query: QueryConversationDto,
  ): Promise<InfinityPaginationResponseDto<ConversationDto>> {
    const page = query?.page ?? 1;
    let limit = query?.limit ?? 20;
    if (limit > 50) {
      limit = 50;
    }

    const { data, totalItems } =
      await this.conversationService.findManyWithPaginationByUserId({
        userId: query.userId,
        paginationOptions: { page, limit },
      });

    return infinityPagination(data, totalItems, { page, limit });
  }

  @ApiOkResponse({ type: ConversationDto })
  @ApiOperation({ summary: 'Find a conversation between two users' })
  @Get('find-by-users')
  @HttpCode(HttpStatus.OK)
  async findBy2UserIds(
    @Query() query: FindConversationQueryDto,
  ): Promise<ConversationDto | null> {
    const conversation = await this.conversationService.findBy2UserIds(query);

    return conversation
      ? this.conversationService.getConversationDto(conversation)
      : null;
  }

  @ApiOperation({ summary: 'Delete a conversation' })
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string): Promise<void> {
    await this.conversationService.remove(id);
  }
}
