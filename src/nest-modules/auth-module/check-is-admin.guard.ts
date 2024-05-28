import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { Observable } from 'rxjs';
import { PayloadUser } from './user.model';

@Injectable()
export class CheckIsAdminGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    if (context.getType() !== 'http') {
      return true;
    }
    const request: Request = context.switchToHttp().getRequest();
    if (!('user' in request)) {
      throw new UnauthorizedException();
    }

    const payload = request.user as PayloadUser;
    const roles = payload?.realm_access?.roles || [];
    if (roles.indexOf('admin-catolg') === -1) {
      throw new ForbiddenException();
    }
  }
}
