import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEmail, IsNotEmpty } from 'class-validator';

export class AuthenticateDto {
  @ApiProperty({
    required: true,
    description: 'E-mail do usuário.',
  })
  @IsString()
  @IsEmail()
  email: string;

  @ApiProperty({
    required: true,
    description: 'Senha do usuário.',
  })
  @IsString()
  @IsNotEmpty()
  password: string;
}