export interface KeycloakConfig {
  realm: string;
  'auth-server-url': string;
  'ssl-required': string;
  resource: string;
  'confidential-port': number;
  'bearer-only': boolean;
}

export interface KeycloakAdminConfig {
  baseUrl: string;
  realmName: string;
}

export interface KeycloakAdminAuth {
  username: string;
  password: string;
  grantType: string;
  clientId: string;
}
