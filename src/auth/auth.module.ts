import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { KeycloakService } from './keycloak.service';
import { KeycloakGuard } from './keycloak.guard';
import { KeycloakConfigService } from './keycloak-config.service';
import { UserService } from './user.service';
import { UserController } from './user.controller';

@Module({
  imports: [ConfigModule],
  controllers: [UserController],
  providers: [
    KeycloakService,
    KeycloakGuard,
    KeycloakConfigService,
    UserService,
  ],
  exports: [KeycloakService, KeycloakGuard, UserService],
})
export class AuthModule {}
