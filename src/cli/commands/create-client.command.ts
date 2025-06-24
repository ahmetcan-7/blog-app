import { Command, CommandRunner } from 'nest-commander';
import { Injectable } from '@nestjs/common';
import { KeycloakService } from '../../auth/keycloak.service';

@Injectable()
@Command({
  name: 'create-client',
  description: 'Create a Keycloak client',
})
export class CreateClientCommand extends CommandRunner {
  constructor(private readonly keycloakService: KeycloakService) {
    super();
  }

  async run(): Promise<void> {
    try {
      await this.keycloakService.createClient({
        clientId: 'blog-client',
        name: 'Blog Client',
        description: 'Client for personal blog application',
        enabled: true,
        publicClient: true,
        redirectUris: ['http://localhost:3000/*'],
        webOrigins: ['http://localhost:3000'],
        standardFlowEnabled: true,
        implicitFlowEnabled: false,
        directAccessGrantsEnabled: true,
        serviceAccountsEnabled: false,
        oauth2DeviceAuthorizationGrantEnabled: false,
        oidcCibaGrantEnabled: false,
      });

      console.log('Client created successfully');
    } catch (error) {
      console.error('Failed to create client:', error);
    }
  }
}
