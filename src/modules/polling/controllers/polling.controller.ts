import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  Post,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiTag } from '@app/enums/api-tags';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AuthenticateGuard } from '@app/guards/authenticate.guard';
import { PollingService } from '../services/polling.service';
import { TransformResponseInterceptor } from '@app/interceptors/transform-response.interceptor';
import {
  createPollingDataResponse,
  createPollingResponse,
  PollingVoteData,
} from '../classes/polling,response';
import { JwtPayload } from '@app/interfaces/jwt-payload.interface';
import { CurrentUser } from '@app/decorators/current-user.decorator';
import { CreatePollingDto } from '../dtos/create-polling.dto';

@ApiTags(ApiTag.POLLING)
@Controller('api/v1/polling')
export class PollingController {
  constructor(private readonly pollingService: PollingService) {}

  @ApiBearerAuth()
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'The polling has been successfully created.',
    type: createPollingResponse,
  })
  @ApiOperation({
    summary: 'Create Polling',
    description: `
### Create a New Polling Session

Creates a new polling with its associated options.

- **Authentication:** This endpoint is protected. A valid **JWT Bearer Token** is required.
- **User ID:** The \`userId\` for the polling creator is automatically extracted from the authenticated user's token.
- **Body:** Requires a JSON object matching the \`CreatePollingDto\` structure.
    `,
  })
  @UseInterceptors(TransformResponseInterceptor)
  @UseGuards(AuthenticateGuard)
  @Post()
  async createPolling(
    @CurrentUser() currentUser: JwtPayload,
    @Body()
    createPollingDto: CreatePollingDto,
  ): Promise<createPollingDataResponse> {
    const poll = await this.pollingService.createPolling(
      createPollingDto,
      currentUser.id,
    );

    return poll;
  }

  @ApiResponse({
    status: HttpStatus.OK,
    type: PollingVoteData,
  })
  @ApiOperation({
    summary: 'Get Polling Vote Data by Polling Code',
  })
  @UseInterceptors(TransformResponseInterceptor)
  @Get(':id')
  async getPollingVoteDataById(
    @Param('id') pollingCode: string,
  ): Promise<PollingVoteData[]> {
    const poll =
      await this.pollingService.getPollingVoteDataByCode(pollingCode);
    return poll;
  }
}
