import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { KeycloakService } from '../keycloak.service';
import { Roles } from '../decorators/roles.decorator';

@Injectable()
export class KeycloakAuthGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private keycloakService: KeycloakService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(Roles, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;

    if (!authHeader) {
      throw new UnauthorizedException('No authorization header');
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      throw new UnauthorizedException('No token provided');
    }

    try {
      const { roles } = await this.keycloakService.validateToken(token);
      return requiredRoles.some((role) => roles.includes(role));
    } catch (error) {
      throw new UnauthorizedException('Invalid token');
    }
  }
}
