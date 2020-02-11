import { Controller, Post, Body, HttpException, HttpStatus, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ResponseDto } from 'src/common/interfaces/response.dto';
import { AuthenticateDto } from './interfaces/login.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService
  ){}

  @Post()
  @UseGuards(AuthGuard('jwt'))
  async authenticate(@Body() { email, password }: AuthenticateDto): Promise<ResponseDto> {
    const user = await this.authService.validateUser(email, password);

    if (!user) throw new HttpException(new ResponseDto(false, null, 'Usuário ou senha inválidos.'), HttpStatus.UNAUTHORIZED);

    return new ResponseDto(true, this.authService.createToken(user));
  }
}