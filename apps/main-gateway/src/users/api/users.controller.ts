import {
  Controller,
  Get,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  BadRequestException,
} from '@nestjs/common';
import { UsersService } from '../application/users.service';
import { CreateUserInputDto } from './input-dto/create-user.input-dto';
import { UserViewDto } from './view-dto/user.view-dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Body() createUserInputDto: CreateUserInputDto,
  ): Promise<UserViewDto> {
    return await this.usersService.create(createUserInputDto);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  async findAll(): Promise<UserViewDto[]> {
    try {
      return await this.usersService.findAll();
    } catch (error) {
      throw new BadRequestException('Failed to fetch users');
    }
  }
}
