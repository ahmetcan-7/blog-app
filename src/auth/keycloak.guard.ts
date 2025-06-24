import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { KeycloakService } from './keycloak.service';
import { UserRole } from './dto/create-user.dto';
import { Request } from 'express';

export const ROLES_KEY = 'roles';

export const Roles = (...roles: string[]) => {
  return (target: any, key: string, descriptor: PropertyDescriptor) => {
    Reflect.defineMetadata(ROLES_KEY, roles, descriptor.value);
    return descriptor;
  };
};

interface TokenValidationResult {
  roles: string[];
}

@Injectable()
export class KeycloakGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private readonly keycloakService: KeycloakService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!requiredRoles) {
      return true;
    }

    const request = context.switchToHttp().getRequest<Request>();
    const authHeader = request.headers.authorization;

    if (!authHeader) {
      throw new UnauthorizedException('No authorization header');
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      throw new UnauthorizedException('No token provided');
    }

    try {
      const result = await this.keycloakService.validateToken(token);
      request['user'] = { roles: result.roles };
      return requiredRoles.some((role) => result.roles.includes(role));
    } catch (error) {
      throw new UnauthorizedException('Invalid token');
    }
  }
}
