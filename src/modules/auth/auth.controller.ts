import { Post, Body, HttpException, HttpStatus } from '@nestjs/common';
import { ResponseDto } from 'src/common/interfaces/response.dto';
import { ApiResponse } from 'src/common/helpers/api-response.helper';
import { AuthService } from './auth.service';
import { AuthenticateDto } from './interfaces/login.dto';
import { Controller } from 'src/common/helpers/controller.helper';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService
  ){}

  @Post()
  @ApiResponse({
    status: 201,
    description: 'E-mail e senha válidos',
  })
  @ApiResponse({
    status: 401,
    description: 'E-mail ou senha inválidos.',
  })
  async authenticate(@Body() { email, password }: AuthenticateDto): Promise<ResponseDto> {
    const user = await this.authService.validateUser(email, password);

    if (!user) throw new HttpException(new ResponseDto(false, null, 'Usuário ou senha inválidos.'), HttpStatus.UNAUTHORIZED);

    return new ResponseDto(true, this.authService.createToken(user));
  }
}