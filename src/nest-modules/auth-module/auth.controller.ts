import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { AuthCredentialsDto } from './dto/auth.dto';
import { KeycloakAuthGuard } from './auth.guard';
import { HasRole } from './gateway/roles.decorator';

@ApiTags('autorização')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @ApiOperation({ summary: 'Autenticar com Keycloak' })
  @ApiBody({ type: AuthCredentialsDto, description: 'Credenciais do usuário' })
  @Post('login')
  async getToken(@Body() credentials: AuthCredentialsDto): Promise<any> {
    const { login, password } = credentials;
    return this.authService.getAccessToken(login, password);
  }

  @ApiOperation({ summary: 'Validar um token' })
  @ApiParam({ name: 'token', description: 'Token a ser validado' })
  @Post(':token')
  async listarById(@Param('token') token: string) {
    return await this.authService.validaToken(token);
  }

  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Teste de autenticação com keycloak' })
  @UseGuards(KeycloakAuthGuard)
  @HasRole('0')
  @Get('test-auth')
  test(@Req() req: any) {
    return {
      message: 'Você está autenticado',
      id_usuario: req.user.id_usuario,
      email: req.user.email,
      id_contract: req.user.id_contract,
      permissions: req.user.permissions,
    };
  }
}
