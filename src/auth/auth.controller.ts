import {
  Controller,
  Post,
  Body,
  Put,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { AuthCreateUserDto } from './dto/create-user.dto';
import { AuthUpdateUserDto } from './dto/update-user.dto';
import { KeycloakAuthGuard } from './guards/keycloak-auth.guard';
import { Roles } from './decorators/roles.decorator';
import { UserRole } from './dto/create-user.dto';

@ApiTags('auth')
@Controller('auth')
@UseGuards(KeycloakAuthGuard)
@ApiBearerAuth()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('users')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Create a new user' })
  @ApiResponse({ status: 201, description: 'User successfully created.' })
  @ApiResponse({ status: 400, description: 'Bad request.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  async createUser(@Body() createUserDto: AuthCreateUserDto) {
    return this.authService.createUser(createUserDto);
  }

  @Put('users/:id')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Update a user' })
  @ApiResponse({ status: 200, description: 'User successfully updated.' })
  @ApiResponse({ status: 400, description: 'Bad request.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 404, description: 'User not found.' })
  async updateUser(
    @Param('id') id: string,
    @Body() updateUserDto: AuthUpdateUserDto,
  ) {
    return this.authService.updateUser(id, updateUserDto);
  }

  @Delete('users/:id')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Delete a user' })
  @ApiResponse({ status: 200, description: 'User successfully deleted.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 404, description: 'User not found.' })
  async deleteUser(@Param('id') id: string) {
    return this.authService.deleteUser(id);
  }
}
