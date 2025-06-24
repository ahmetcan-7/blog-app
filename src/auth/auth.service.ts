import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { KeycloakService } from './keycloak.service';
import { AuthCreateUserDto } from './dto/create-user.dto';
import { AuthUpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(private readonly keycloakService: KeycloakService) {}

  async createUser(createUserDto: AuthCreateUserDto): Promise<{ id: string }> {
    try {
      const user = await this.keycloakService.createUser(createUserDto);
      await this.keycloakService.assignRole(user.id, createUserDto.role);
      return user;
    } catch (error) {
      this.logger.error('Failed to create user:', error);
      throw new UnauthorizedException('Failed to create user');
    }
  }

  async updateUser(
    userId: string,
    updateUserDto: AuthUpdateUserDto,
  ): Promise<void> {
    try {
      // TODO: Implement user update logic
      this.logger.log(`Updating user ${userId}`);
    } catch (error) {
      this.logger.error('Failed to update user:', error);
      throw new UnauthorizedException('Failed to update user');
    }
  }

  async deleteUser(userId: string): Promise<void> {
    try {
      // TODO: Implement user deletion logic
      this.logger.log(`Deleting user ${userId}`);
    } catch (error) {
      this.logger.error('Failed to delete user:', error);
      throw new UnauthorizedException('Failed to delete user');
    }
  }

  async validateToken(token: string): Promise<{ roles: string[] }> {
    try {
      return await this.keycloakService.validateToken(token);
    } catch (error) {
      this.logger.error('Token validation failed:', error);
      throw new UnauthorizedException('Invalid token');
    }
  }
}
