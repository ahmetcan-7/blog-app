import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostsService } from './posts.service';
import { PostsController } from './posts.controller';
import { Post } from './entities/post.entity';
import { CacheModule } from '../../cache/cache.module';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { CacheInterceptor } from '../../cache/cache.interceptor';

@Module({
  imports: [TypeOrmModule.forFeature([Post]), CacheModule],
  controllers: [PostsController],
  providers: [
    PostsService,
    {
      provide: APP_INTERCEPTOR,
      useClass: CacheInterceptor,
    },
  ],
  exports: [PostsService],
})
export class PostsModule {}
