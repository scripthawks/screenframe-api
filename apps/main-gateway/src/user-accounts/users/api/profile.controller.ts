import {
  Controller,
  Body,
  HttpCode,
  HttpStatus,
  Post,
  Get,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  Patch,
  Param,
} from '@nestjs/common';
import { JwtAuthGuard } from 'apps/main-gateway/src/core/guards/jwt-auth.guard';
import { CurrentUserId } from '@app/core/decorators/params';
import { FileInterceptor } from '@nestjs/platform-express';
import { CreateProfileInputDto } from './input-dto/create-profile.input-dto';
import { UpdateProfileInputDto } from './input-dto/update-profile.input-dto';
import { CreateUserProfileCommand } from '../application/use-case/create-profile.use-case';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { ProfileViewDto } from './view-dto/profile.view-dto';
import { GetUserProfileQuery } from '../application/queries/get-profile.query';
import { UpdateUserProfileCommand } from '../application/use-case/update-profile.use-case';
import { DomainException } from '@app/core/exceptions/domain.exception';
import { CommonExceptionCodes } from '@app/core/exceptions/enums/common-exception-codes.enum';

@Controller('profile')
export class ProfileController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Get('/:userId')
  @HttpCode(HttpStatus.OK)
  async getProfile(@Param('userId') userId: string): Promise<ProfileViewDto> {
    return await this.queryBus.execute(new GetUserProfileQuery(userId));
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  @UseInterceptors(
    FileInterceptor('avatar', {
      limits: {
        fileSize: 10 * 1024 * 1024,
      },
    }),
  )
  @HttpCode(HttpStatus.CREATED)
  async createProfile(
    @CurrentUserId() userId: string,
    @Body() dto: CreateProfileInputDto,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<ProfileViewDto> {
    await this.commandBus.execute(
      new CreateUserProfileCommand(userId, dto, file),
    );
    return await this.queryBus.execute(new GetUserProfileQuery(userId));
  }

  @UseGuards(JwtAuthGuard)
  @Patch()
  @UseInterceptors(
    FileInterceptor('avatar', {
      limits: {
        fileSize: 10 * 1024 * 1024,
      },
    }),
  )
  @HttpCode(HttpStatus.OK)
  async updateProfile(
    @CurrentUserId() userId: string,
    @Body() dto: UpdateProfileInputDto,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<ProfileViewDto> {
    const isHasAvatar = !!file;
    const isHasChanges = Object.keys(dto).length > 0;
    const hasChanges = isHasAvatar || isHasChanges;
    if (!hasChanges) {
      throw new DomainException(
        CommonExceptionCodes.BAD_REQUEST,
        'No data to update',
      );
    }

    await this.commandBus.execute(
      new UpdateUserProfileCommand(userId, dto, isHasChanges, file),
    );

    return await this.queryBus.execute(new GetUserProfileQuery(userId));
  }
}
