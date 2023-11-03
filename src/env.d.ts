/* eslint-disable no-unused-vars */
/// <reference types="vite/client" />
interface ImportMetaEnv {
  readonly VITE_BASE_URL: string;
  readonly VITE_APP_ENVIRONMENT: string;
  readonly VITE_APP_PRODUCTION_URL: string;
  readonly VITE_APP_DEVELOPMENT_URL: string;
  readonly VITE_APP_REDIRECT_URI: string;
  readonly VITE_API_URI: string;
  readonly VITE_ROOT_DIRECTORY: string;
  readonly VITE_SCOPES: string;

  readonly VITE_APP_AUTH_IDM_ROLE_ADMIN: string;
  readonly VITE_APP_POWERBI_URL: string;

  readonly VITE_APP_AUTH_CLIENT: string;
  readonly VITE_APP_AUTH_AUTHORITY: string;
  readonly VITE_APP_AUTH_IDM_ROLES: string;

  readonly VITE_APP_I18N_LOCALE: string;
  readonly VITE_APP_I18N_FALLBACK_LOCALE: string;

  readonly VITE_APP_CONTAINER_FILE_PATH: string;
  readonly VITE_APP_CONTAINER_ATTACHMENT: string;
  readonly VITE_APP_CONTAINER_DOCUMENT: string;
  readonly VITE_APP_CONTAINER_TEMPLATE: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

declare module '*.vue' {
  import { DefineComponent } from 'vue';
  const component: DefineComponent<{}, {}, any>;
  export default component;
}

declare module 'velocity-animate';

declare var process: {
  env: {
    NODE_ENV: string;
  };
};
