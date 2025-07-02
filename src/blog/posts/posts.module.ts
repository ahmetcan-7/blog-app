import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostsService } from './posts.service';
import { PostsController } from './posts.controller';
import { Post } from './entities/post.entity';
import { UsersModule } from '../users/users.module';
import { KeycloakAuthGuard } from 'src/auth/guards/keycloak-auth.guard';
import { AppCacheModule } from '../../cache/cache.module';

@Module({
  imports: [TypeOrmModule.forFeature([Post]), AppCacheModule, UsersModule],
  controllers: [PostsController],
  providers: [PostsService, KeycloakAuthGuard],
  exports: [PostsService],
})
export class PostsModule {}
