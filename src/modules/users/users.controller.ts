import { Post, HttpStatus, Body, ConflictException } from '@nestjs/common';

import { Controller } from 'src/common/helpers/controller.helper';
import { ResponseDto } from 'src/common/interfaces/response.dto';
import { ApiResponse } from 'src/common/helpers/api-response.helper';
import { CommonMessages } from 'src/common/enums/messages.enum';

import { UsersService } from './users.service';
import { CreateUserDto } from './dtos/create-user.dto';
import { UserMessages } from './enums/messages.enum';

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService
  ){}

  @Post('register')
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: UserMessages.REGISTERED,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: CommonMessages.BAD_REQUEST,
  })
  async createUser(@Body() data: CreateUserDto): Promise<ResponseDto> {
    try {
      const user = await this.usersService.create(data);

      return new ResponseDto(true, user, UserMessages.REGISTERED);
    } catch (error) {
      switch(error.code) {
      case 11000:
        throw new ConflictException(new ResponseDto(false, null, UserMessages.DUPLICATED));
      default:
        throw error;
      }    
    }
  }
}