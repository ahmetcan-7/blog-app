import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class KeycloakConfigService {
  constructor(private configService: ConfigService) {}

  getKeycloakConfig() {
    const realm = this.configService.get<string>('KEYCLOAK_REALM');
    const authUrl = this.configService.get<string>('KEYCLOAK_AUTH_URL');
    const clientId = this.configService.get<string>('KEYCLOAK_CLIENT_ID');

    if (!realm || !authUrl || !clientId) {
      throw new Error('Missing required Keycloak configuration');
    }

    return {
      realm,
      'auth-server-url': authUrl,
      'ssl-required': 'external',
      resource: clientId,
      'public-client': true,
      'confidential-port': 0,
    };
  }

  getKeycloakAdminConfig() {
    const authUrl = this.configService.get<string>('KEYCLOAK_AUTH_URL');
    const realm = this.configService.get<string>('KEYCLOAK_REALM');

    if (!authUrl || !realm) {
      throw new Error('Missing required Keycloak admin configuration');
    }

    return {
      baseUrl: authUrl,
      realmName: realm,
    };
  }

  getKeycloakAdminAuth() {
    const username = this.configService.get<string>('KEYCLOAK_ADMIN_USERNAME');
    const password = this.configService.get<string>('KEYCLOAK_ADMIN_PASSWORD');
    const clientId = this.configService.get<string>('KEYCLOAK_CLIENT_ID');

    if (!username || !password || !clientId) {
      throw new Error('Missing required Keycloak admin credentials');
    }

    return {
      username,
      password,
      clientId,
    };
  }
}
