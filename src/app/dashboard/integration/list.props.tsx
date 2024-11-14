// src/types/IntegrationTypes.ts

export interface Permissions {
  admins?: string;
  others?: string;
  users?: string[];
  groups?: string[];
}

export interface Integration {
  id?: number;
  name?: string;
  scope?: string;
}

export interface FormIntegration {
  type: string;
  name: string;
  personalToken: string;
}

// Define types for integration data
export interface CreateIntegrationRequest {
  integration_name: string;
  provider_code: string;
  access_token: string;
}

export interface IntegrationResponse {
  code: number;
  message: string;
}