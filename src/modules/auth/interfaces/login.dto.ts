import { ApiProperty } from '@nestjs/swagger';

export class AuthenticateDto {
  @ApiProperty({
    required: true,
    description: 'E-mail do usuário.',
  })
  email: string;

  @ApiProperty({
    required: true,
    description: 'Senha do usuário.',
  })
  password: string;
}