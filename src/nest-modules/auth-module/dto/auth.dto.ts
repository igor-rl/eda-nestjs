import { ApiProperty } from '@nestjs/swagger';

export class AuthCredentialsDto {
  @ApiProperty({ description: 'Nome de usuário' })
  login: string;

  @ApiProperty({ description: 'Senha do usuário' })
  password: string;
}
