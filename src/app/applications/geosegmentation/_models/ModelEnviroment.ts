export class ModelEnvironment {
  name: string;
  version: string;
  production: boolean;
  userNameDev?: string;
  homepage?: string;
  appName?: string;
  isDemo?: boolean;
  apis?: APILink[];
  admins: string[];
}

export class APILink {
  environment?: string;
  organisation?: string;
  service: string;
}
