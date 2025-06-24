import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
  NotFoundException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Roles } from '../decorators/roles.decorator';
import { jwtDecode } from 'jwt-decode';
import { UsersService } from 'src/blog/users/users.service';

interface DecodedToken {
  sub: string;
  realm_access: {
    roles: string[];
  };
  email: string;
  preferred_username: string;
  given_name: string;
  family_name: string;
}

@Injectable()
export class KeycloakAuthGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private readonly usersService: UsersService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(Roles, [
      context.getHandler(),
      context.getClass(),
    ]);

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
      const decodedToken = jwtDecode<DecodedToken>(token);
      let userInDb;

      try {
        userInDb = await this.usersService.findOne(decodedToken.sub);
      } catch (error) {
        if (error instanceof NotFoundException) {
          userInDb = await this.usersService.create(
            {
              email: decodedToken.email,
              username: decodedToken.preferred_username,
              firstName: decodedToken.given_name,
              lastName: decodedToken.family_name,
            },
            decodedToken.sub,
          );
        } else {
          throw error;
        }
      }

      request.user = userInDb;

      const roles = decodedToken.realm_access?.roles || [];
      if (!requiredRoles) {
        return true;
      }

      return requiredRoles.some((role) => roles.includes(role));
    } catch (error) {
      throw new UnauthorizedException(
        'Invalid token or user processing failed',
      );
    }
  }
}
