import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CreateClientCommand } from './commands/create-client.command';
import { CreateAdminCommand } from './commands/create-admin.command';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    AuthModule,
  ],
  providers: [CreateClientCommand, CreateAdminCommand],
})
export class CliModule {}
