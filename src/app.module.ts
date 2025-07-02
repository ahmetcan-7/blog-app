import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { BlogModule } from './blog/blog.module';
import { AppCacheModule } from './cache/cache.module';
import { DatabaseModule } from './config/database.module';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { CacheInterceptor } from './cache/cache.interceptor';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    DatabaseModule,
    AppCacheModule,
    AuthModule,
    BlogModule,
  ],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: CacheInterceptor,
    },
  ],
})
export class AppModule {}
