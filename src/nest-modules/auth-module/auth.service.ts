import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import axios from 'axios';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async getAccessToken(login: string, password: string): Promise<any> {
    const url = this.configService.get<string>('KEYCLOAK_URL');
    const realm = this.configService.get<string>('KEYCLOAK_REALM');
    const clientId = this.configService.get<string>('KEYCLOAK_ADMIN_CLIENT_ID');
    const clientSecret = this.configService.get<string>(
      'KEYCLOAK_ADMIN_CLIENT_SECRET',
    );
    const tokenEndpoint = `${url}/realms/${realm}/protocol/openid-connect/token`;
    const payload = new URLSearchParams();
    payload.append('grant_type', 'password');
    // payload.append('scope', 'openid');
    payload.append('client_id', clientId);
    payload.append('client_secret', clientSecret);
    payload.append('username', login);
    payload.append('password', password);

    try {
      const response = await axios.post(tokenEndpoint, payload.toString(), {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      });
      return response.data;
    } catch (error) {
      console.log('Erro ao tentar obter o token:', error.message || error);
      return error;
    }
  }

  async validaToken(token: string) {
    const decodeToken = this.jwtService.decode(token);
    if (Math.floor(Date.now() / 1000) >= decodeToken['exp']) {
      throw new UnauthorizedException();
    }
    return decodeToken;
  }
}
