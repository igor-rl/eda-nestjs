import {
  Injectable,
  ExecutionContext,
  UnauthorizedException,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { HAS_ROLE_KEY } from './gateway/roles.decorator';

@Injectable()
export class KeycloakAuthGuard extends AuthGuard('keycloak') {
  constructor(private readonly reflector: Reflector) {
    super();
  }

  async canActivate(context: ExecutionContext) {
    const isAuthed = await super.canActivate(context);

    if (!isAuthed) {
      throw new UnauthorizedException();
    }

    const requiredRole = String(
      this.reflector.get<string>(HAS_ROLE_KEY, context.getHandler()),
    );

    if (!requiredRole) {
      return true;
    }

    const request = context.switchToHttp().getRequest();

    if (request?.user?.permissions.length) {
      if (request.user.permissions.includes(requiredRole)) {
        return true;
      }
    }

    throw new ForbiddenException(
      'Você não tem permissão para acessar esse recurso: ',
    );
  }
}
