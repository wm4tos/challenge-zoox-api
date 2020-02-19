import { Post, Body, HttpException, HttpStatus, Controller, NotFoundException } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { ResponseDto } from 'src/common/interfaces/response.dto';
import { ApiResponse } from 'src/common/helpers/api-response.helper';

import { AuthService } from './auth.service';
import { AuthenticateDto } from './interfaces/login.dto';
import { AuthMessages } from './enums/messages.enum';

@Controller('auth')
@ApiTags('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService
  ){}

  @Post()
  @ApiResponse({
    status: 201,
    description: AuthMessages.OK,
  })
  @ApiResponse({
    status: 401,
    description: AuthMessages.INVALID,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: AuthMessages.NOT_FOUND,
  })
  async authenticate(@Body() { email, password }: AuthenticateDto): Promise<ResponseDto> {
    const userExists = await this.authService.userExists(email);

    if (!userExists) throw new NotFoundException(new ResponseDto(false, null, AuthMessages.NOT_FOUND))

    const user = await this.authService.validateUserAndPassword(email, password);

    if (!user) throw new HttpException(new ResponseDto(false, null, AuthMessages.INVALID), HttpStatus.UNAUTHORIZED);

    return new ResponseDto(true, this.authService.createToken(user));
  }
}