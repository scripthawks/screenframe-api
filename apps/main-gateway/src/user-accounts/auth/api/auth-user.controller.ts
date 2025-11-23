import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { CreateUserInputDto } from '../../users/api/input-dto/create-user.input-dto';
import { ApiTags } from '@nestjs/swagger';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { SignUpCommand } from '../application/use-cases/sign-up.use-case';

@ApiTags('Auth')
@Controller('auth')
export class AuthUsersController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Post('signup')
  @HttpCode(HttpStatus.OK)
  async createUser(@Body() userDto: CreateUserInputDto): Promise<void> {
    await this.commandBus.execute(new SignUpCommand(userDto));
  }
}
