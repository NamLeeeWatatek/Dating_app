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
  SerializeOptions,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from '../roles/roles.decorator';
import { RoleEnum } from '../roles/roles.enum';
import { RolesGuard } from '../roles/roles.guard';

import {
  InfinityPaginationResponse,
  InfinityPaginationResponseDto,
} from '../utils/dto/infinity-pagination-response.dto';
import { infinityPagination } from '../utils/infinity-pagination';

import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';
import { QueryMessageDto } from './dto/query-message.dto';
import { MessageService } from './message.service';
import { Message } from './domain/messsage';
import { UpdateReadAtDto } from './dto/update-read-at.dto';
import { MessageDto } from './dto/message.dto';

@ApiBearerAuth()
@Roles(RoleEnum.user, RoleEnum.admin)
@UseGuards(AuthGuard('jwt'), RolesGuard)
@ApiTags('Messages')
@Controller({
  path: 'messages',
  version: '1',
})
export class MessageController {
  constructor(private readonly messageService: MessageService) {}

  @ApiCreatedResponse({
    type: Message,
    description: 'Returns newly created message.',
  })
  @ApiOperation({
    summary: 'Create new message',
  })
  @SerializeOptions({
    groups: ['user'],
  })
  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createMessageDto: CreateMessageDto): Promise<Message> {
    return this.messageService.create(createMessageDto);
  }

  @ApiOkResponse({
    type: InfinityPaginationResponse(Message),
  })
  @ApiOperation({
    summary: 'Get list of messages',
  })
  @SerializeOptions({
    groups: ['user'],
  })
  @Get()
  @HttpCode(HttpStatus.OK)
  async findAll(
    @Query() query: QueryMessageDto,
  ): Promise<InfinityPaginationResponseDto<MessageDto>> {
    const page = query?.page ?? 1;
    let limit = query?.limit ?? 20;
    if (limit > 50) {
      limit = 50;
    }

    const { data: entityData, totalItems } =
      await this.messageService.findManyWithPagination({
        senderId: query.senderId,
        receiverId: query.receiverId,
        paginationOptions: {
          page,
          limit,
        },
      });

    const dtos = entityData.map((entity) => new MessageDto(entity));

    return infinityPagination(dtos, totalItems, { page, limit });
  }

  @Patch('/mark-as-read')
  @ApiOperation({ summary: 'Mark all unread messages as read' })
  async markMessagesAsRead(
    @Body() updateReadAtDto: UpdateReadAtDto,
  ): Promise<void> {
    console.log('updateReadAtDto: ', updateReadAtDto);
    return this.messageService.markMessagesAsRead(updateReadAtDto);
  }

  @ApiOkResponse({
    type: Message,
  })
  @SerializeOptions({
    groups: ['user'],
  })
  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @ApiParam({
    name: 'id',
    type: String,
    required: true,
  })
  @ApiBody({ type: UpdateMessageDto }) // Thêm dòng này
  update(
    @Param('id') id: Message['id'],
    @Body() updateMessageDto: UpdateMessageDto,
  ): Promise<Message | null> {
    return this.messageService.update(id, updateMessageDto);
  }

  @Delete(':id')
  @ApiParam({
    name: 'id',
    type: String,
    required: true,
  })
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: Message['id']): Promise<void> {
    return this.messageService.remove(id);
  }
}
