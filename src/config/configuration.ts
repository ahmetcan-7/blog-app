import { registerAs } from '@nestjs/config';

export interface DatabaseConfig {
  host: string;
  port: number;
  username: string;
  password: string;
  database: string;
}

export interface RedisConfig {
  host: string;
  port: number;
  password?: string;
}

export interface KeycloakConfig {
  realm: string;
  'auth-server-url': string;
  'ssl-required': string;
  resource: string;
  'confidential-port': number;
  'bearer-only': boolean;
  adminUsername: string;
  adminPassword: string;
  adminClientId: string;
}

export interface SecurityConfig {
  jwtSecret: string;
  jwtExpiresIn: string;
  bcryptSaltRounds: number;
}

export interface AppConfig {
  port: number;
  database: DatabaseConfig;
  redis: RedisConfig;
  keycloak: KeycloakConfig;
  security: SecurityConfig;
}

export default registerAs(
  'app',
  (): AppConfig => ({
    port: parseInt(process.env.PORT || '3000', 10),
    database: {
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '5432', 10),
      username: process.env.DB_USERNAME || 'postgres',
      password: process.env.DB_PASSWORD || 'postgres',
      database: process.env.DB_DATABASE || 'personal_blog',
    },
    redis: {
      host: process.env.REDIS_HOST || 'localhost',
      port: parseInt(process.env.REDIS_PORT || '6379', 10),
      password: process.env.REDIS_PASSWORD,
    },
    keycloak: {
      realm: process.env.KEYCLOAK_REALM || 'personal-blog',
      'auth-server-url':
        process.env.KEYCLOAK_AUTH_URL || 'http://localhost:8080',
      'ssl-required': 'external',
      resource: process.env.KEYCLOAK_CLIENT_ID || 'blog-api',
      'confidential-port': 0,
      'bearer-only': true,
      adminUsername: process.env.KEYCLOAK_ADMIN_USERNAME || 'admin',
      adminPassword: process.env.KEYCLOAK_ADMIN_PASSWORD || 'admin',
      adminClientId: process.env.KEYCLOAK_ADMIN_CLIENT_ID || 'admin-cli',
    },
    security: {
      jwtSecret: process.env.JWT_SECRET || 'your-secret-key',
      jwtExpiresIn: process.env.JWT_EXPIRES_IN || '1d',
      bcryptSaltRounds: parseInt(process.env.BCRYPT_SALT_ROUNDS || '10', 10),
    },
  }),
);
