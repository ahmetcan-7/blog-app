import { Module, forwardRef } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { KeycloakService } from './keycloak.service';
import { KeycloakGuard } from './keycloak.guard';
import { KeycloakConfigService } from './keycloak-config.service';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersModule } from '../blog/users/users.module';

@Module({
  imports: [ConfigModule, forwardRef(() => UsersModule)],
  controllers: [UserController, AuthController],
  providers: [
    KeycloakService,
    KeycloakGuard,
    KeycloakConfigService,
    UserService,
    AuthService,
  ],
  exports: [KeycloakService, KeycloakGuard, UserService, AuthService],
})
export class AuthModule {}
