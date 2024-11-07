// src/types/IntegrationTypes.ts

export interface Permissions {
    admins?: string;
    others?: string;
    users?: string[];
    groups?: string[];
  }
  
  export interface Integration {
    url?: string;
    html_url?: string;
    hash_id?: string;
    name?: string;
    type?: string;
    scope?: string;
    identifier?: string;
    all_pipelines_allowed?: boolean;
    permissions?: Permissions;
    allowed_pipelines?: string[];
  }

  export interface FormIntegration {
    type: string;
    name: string;
    personalToken: string;
  }