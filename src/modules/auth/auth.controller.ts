import { Post, Body, HttpStatus, Controller, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { ResponseDto } from 'src/common/interfaces/response.dto';
import { ApiResponse } from 'src/common/helpers/api-response.helper';
import { CommonMessages } from 'src/common/enums/messages.enum';

import { AuthService } from './auth.service';
import { AuthenticateDto } from './dtos/login.dto';
import { AuthMessages } from './enums/messages.enum';

@Controller('auth')
@ApiTags('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService
  ){}

  @Post()
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: AuthMessages.OK,
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: AuthMessages.INVALID,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: AuthMessages.NOT_FOUND,
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: CommonMessages.UNAUTHORIZED,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: CommonMessages.BAD_REQUEST,
  })
  async authenticate(@Body() { email, password }: AuthenticateDto): Promise<ResponseDto> {
    const userExists = await this.authService.userExists(email);

    if (!userExists) throw new NotFoundException(new ResponseDto(false, null, AuthMessages.NOT_FOUND));

    const user = await this.authService.validateUserAndPassword(email, password);

    if (!user) throw new UnauthorizedException(new ResponseDto(false, null, AuthMessages.INVALID));

    return new ResponseDto(true, { user, token: this.authService.createToken(user) });
  }
}