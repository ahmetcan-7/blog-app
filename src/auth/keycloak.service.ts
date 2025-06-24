import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import * as KeycloakConnect from 'keycloak-connect';
import { Token } from 'keycloak-connect';
import KeycloakAdminClient from 'keycloak-admin';
import { KeycloakConfigService } from './keycloak-config.service';
import { AuthCreateUserDto, UserRole } from './dto/create-user.dto';

interface TokenValidationResult {
  roles: string[];
}

interface TokenContent {
  realm_access?: {
    roles: string[];
  };
}

interface KeycloakGrant {
  access_token: {
    content: TokenContent;
  };
}

interface CreateClientDto {
  clientId: string;
  name: string;
  description?: string;
  enabled: boolean;
  publicClient: boolean;
  redirectUris: string[];
  webOrigins: string[];
  standardFlowEnabled: boolean;
  implicitFlowEnabled: boolean;
  directAccessGrantsEnabled: boolean;
  serviceAccountsEnabled: boolean;
  oauth2DeviceAuthorizationGrantEnabled: boolean;
  oidcCibaGrantEnabled: boolean;
}

interface KeycloakConfig {
  realm: string;
  'auth-server-url': string;
  'ssl-required': string;
  resource: string;
  'public-client': boolean;
  'confidential-port': number;
}

@Injectable()
export class KeycloakService {
  private keycloak: KeycloakConnect.Keycloak;
  private adminClient: KeycloakAdminClient;
  private readonly logger = new Logger(KeycloakService.name);

  constructor(private configService: KeycloakConfigService) {
    const config = this.configService.getKeycloakConfig();
    if (!config.realm || !config['auth-server-url'] || !config.resource) {
      throw new Error('Invalid Keycloak configuration');
    }

    // Initialize Keycloak Connect
    this.keycloak = new KeycloakConnect({}, config as KeycloakConfig);

    // Initialize Keycloak Admin Client
    this.adminClient = new KeycloakAdminClient(
      this.configService.getKeycloakAdminConfig(),
    );
  }

  async validateToken(token: string): Promise<TokenValidationResult> {
    try {
      const grant = (await this.keycloak.grantManager.createGrant({
        access_token: token as unknown as Token,
      })) as unknown as KeycloakGrant;

      const content = grant.access_token.content;

      if (!content?.realm_access?.roles) {
        throw new UnauthorizedException('Invalid token structure');
      }

      return {
        roles: content.realm_access.roles,
      };
    } catch (error) {
      this.logger.error('Token validation failed:', error);
      throw new UnauthorizedException('Invalid token');
    }
  }

  async createUser(createUserDto: AuthCreateUserDto): Promise<{ id: string }> {
    try {
      // Authenticate admin client
      await this.adminClient.auth({
        ...this.configService.getKeycloakAdminAuth(),
        grantType: 'password',
      });

      // Create user
      const user = {
        username: createUserDto.username,
        email: createUserDto.email,
        firstName: createUserDto.firstName,
        lastName: createUserDto.lastName,
        enabled: true,
        credentials: [
          {
            type: 'password',
            value: createUserDto.password,
            temporary: false,
          },
        ],
      };

      const createdUser = await this.adminClient.users.create({
        realm: this.configService.getKeycloakAdminConfig().realmName,
        ...user,
      });

      return { id: createdUser.id };
    } catch (error) {
      this.logger.error('Failed to create user:', error);
      throw new Error('Failed to create user');
    }
  }

  async assignRole(userId: string, role: UserRole): Promise<void> {
    try {
      // Authenticate admin client
      await this.adminClient.auth({
        ...this.configService.getKeycloakAdminAuth(),
        grantType: 'password',
      });

      // Get role
      const roles = await this.adminClient.roles.find({
        realm: this.configService.getKeycloakAdminConfig().realmName,
      });

      const roleToAssign = roles.find((r) => r.name === role);
      if (!roleToAssign) {
        throw new Error(`Role ${role} not found`);
      }

      // Assign role to user
      await this.adminClient.users.addRealmRoleMappings({
        id: userId,
        realm: this.configService.getKeycloakAdminConfig().realmName,
        roles: [
          {
            id: roleToAssign.id!,
            name: roleToAssign.name!,
          },
        ],
      });
    } catch (error) {
      this.logger.error('Failed to assign role:', error);
      throw new Error('Failed to assign role');
    }
  }

  async createClient(createClientDto: CreateClientDto): Promise<void> {
    try {
      // Authenticate admin client
      await this.adminClient.auth({
        ...this.configService.getKeycloakAdminAuth(),
        grantType: 'password',
      });

      // Create client
      await this.adminClient.clients.create({
        realm: this.configService.getKeycloakAdminConfig().realmName,
        ...createClientDto,
      });
    } catch (error) {
      this.logger.error('Failed to create client:', error);
      throw new Error('Failed to create client');
    }
  }
}
