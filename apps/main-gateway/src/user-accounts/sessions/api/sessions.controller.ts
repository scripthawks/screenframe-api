import {
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  UseGuards,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { ApiCookieAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { RefreshTokenGuard } from '../../core/guards/refresh-token.guard';
import { CurrentSessionId, CurrentUserId } from '@app/core/decorators/params';
import { GetSessionsQuery } from '../application/queries/get-sessions.query';
import { SessionsViewDto } from './view-dto/sessions.view-dto';
import {
  ApiForbiddenConfiguredResponse,
  ApiNoContentConfiguredResponse,
  ApiNotFoundConfiguredResponse,
  ApiOkConfiguredResponse,
  ApiUnauthorizedConfiguredResponse,
} from '@app/core/decorators/swagger';
import { DeleteAllSessionsExcludingCurrentCommand } from '../application/use-cases/delete-all-sessions-excluding-current.use-case';
import { DeleteSessionsCommand } from '../application/use-cases/delete-security-device.use-case';

@ApiTags('Sessions')
@Controller('sessions')
@ApiCookieAuth('refreshToken')
export class SessionsController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Get()
  @UseGuards(RefreshTokenGuard)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary:
      'Get all active user sessions. Retrieves a list of all active sessions for the current user. Requires valid refresh token in HTTP-only cookie.',
  })
  @ApiOkConfiguredResponse(
    SessionsViewDto,
    'Successfully retrieved user sessions',
    false,
  )
  @ApiUnauthorizedConfiguredResponse(
    'Invalid, expired or missing refresh token',
  )
  async getAll(
    @CurrentUserId() currentUserId: string,
  ): Promise<SessionsViewDto[]> {
    return await this.queryBus.execute(new GetSessionsQuery(currentUserId));
  }

  @Delete('terminate-all')
  @UseGuards(RefreshTokenGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary:
      'Terminate all other sessions. Terminates all user sessions except the current one. Useful for security purposes when user wants to log out from all other devices. Requires valid refresh token in HTTP-only cookie.',
  })
  @ApiNoContentConfiguredResponse('All other sessions terminated successfully')
  @ApiUnauthorizedConfiguredResponse(
    'Invalid, expired or missing refresh token',
  )
  async delete(
    @CurrentUserId() currentUserId: string,
    @CurrentSessionId() currentSessionId: string,
  ) {
    await this.commandBus.execute(
      new DeleteAllSessionsExcludingCurrentCommand(
        currentUserId,
        currentSessionId,
      ),
    );
  }

  @Delete(':sessionId')
  @UseGuards(RefreshTokenGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Terminate specific session.' })
  @ApiNoContentConfiguredResponse('Session terminated successfully')
  @ApiUnauthorizedConfiguredResponse(
    'Invalid, expired or missing refresh token',
  )
  @ApiForbiddenConfiguredResponse("Attempt to terminate another user's session")
  @ApiNotFoundConfiguredResponse('Session with specified ID not found')
  async deleteById(
    @CurrentUserId() currentUserId: string,
    @Param('sessionId') sessionId: string,
  ) {
    await this.commandBus.execute(
      new DeleteSessionsCommand(currentUserId, sessionId),
    );
  }
}
