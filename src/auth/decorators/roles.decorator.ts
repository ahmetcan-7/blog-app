import { SetMetadata } from '@nestjs/common';
import { UserRole } from '../dto/create-user.dto';

export const Roles = (...roles: UserRole[]) => SetMetadata('roles', roles);
