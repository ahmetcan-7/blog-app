import { Command, CommandRunner, Option } from 'nest-commander';
import { Injectable } from '@nestjs/common';
import { KeycloakService } from '../../auth/keycloak.service';
import { AuthCreateUserDto, UserRole } from '../../auth/dto/create-user.dto';

@Injectable()
@Command({
  name: 'create-admin',
  description: 'Create an admin user',
})
export class CreateAdminCommand extends CommandRunner {
  constructor(private readonly keycloakService: KeycloakService) {
    super();
  }

  async run(
    passedParams: string[],
    options?: Record<string, any>,
  ): Promise<void> {
    const [username, email, password] = passedParams;

    if (!username || !email || !password) {
      console.error('Please provide username, email and password');
      return;
    }

    try {
      const createUserDto: AuthCreateUserDto = {
        username,
        email,
        password,
        firstName: 'Admin',
        lastName: 'User',
        role: UserRole.ADMIN,
      };

      await this.keycloakService.createUser(createUserDto);
      console.log('Admin user created successfully');
    } catch (error) {
      console.error('Failed to create admin user:', error);
    }
  }

  @Option({
    flags: '-u, --username [username]',
    description: 'Admin username',
  })
  parseUsername(val: string): string {
    return val;
  }

  @Option({
    flags: '-e, --email [email]',
    description: 'Admin email',
  })
  parseEmail(val: string): string {
    return val;
  }

  @Option({
    flags: '-p, --password [password]',
    description: 'Admin password',
  })
  parsePassword(val: string): string {
    return val;
  }
}
