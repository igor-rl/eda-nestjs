import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { FindUserPermissionsUseCase } from '../../../core/user-permission/application/use-cases/find/find-user-permissions.use-case';

@Injectable()
export class KeycloakStrategy extends PassportStrategy(Strategy, 'keycloak') {
  constructor(
    configService: ConfigService,
    private readonly findUserPermissionsUseCase: FindUserPermissionsUseCase,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get('JWT_PUBLIC_KEY'),
    });
  }

  async validate(payload: any) {
    if (!payload?.id_contract) {
      new Error('Usuário não tem contrato definido');
    }
    if (!payload?.id_usuario) {
      new Error('Usuário não tem id definido');
    }
    const permissions = await this.findUserPermissionsUseCase.execute({
      id_contract: payload.id_contract,
      id_user: payload.id_usuario,
    });
    payload.permissions = permissions.permissions;
    return payload;
  }
}
