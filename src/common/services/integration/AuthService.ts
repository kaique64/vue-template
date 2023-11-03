import { PublicClientApplication } from '@azure/msal-browser';
import { SilentRequest } from '@azure/msal-browser/dist/request/SilentRequest';
import { AccountInfo, AuthenticationResult } from '@azure/msal-common';
import { Configuration } from '@azure/msal-browser/dist/config/Configuration';
import { SsoSilentRequest } from '@azure/msal-browser/dist/request/SsoSilentRequest';
import cloudDiscoveryMetadata from './aad/CloudDiscoveryMetadata';
import authorityMetadata from './aad/AuthorityMetadata';
import { JwtService } from './JwtService';
import { JwtTokenType } from './type/JwtTokenType';

// Key used dto store the current username in local storage for silent logins
const AUTH_UPN_KEY = 'auth-upn';

export const AUTH_COUNTRY = 'auth-country';

// Configuration for MSAL (the variables are in .env)
const msalConfig: Configuration = {
  auth: {
    clientId: import.meta.env.VITE_APP_AUTH_CLIENT,
    authority: import.meta.env.VITE_APP_AUTH_AUTHORITY,
    redirectUri: import.meta.env.VITE_APP_REDIRECT_URI,
    knownAuthorities: [import.meta.env.VITE_APP_AUTH_AUTHORITY],
    cloudDiscoveryMetadata: JSON.stringify(cloudDiscoveryMetadata),
    authorityMetadata: JSON.stringify(authorityMetadata),
  },
  cache: {
    cacheLocation: 'localStorage',
  },
};

const scopes: string[] = [import.meta.env.VITE_SCOPES];

const loginRequest: { scopes: string[]; domainHint: string } = {
  scopes,
  domainHint: 'bosch.com',
};

const tokenRequest = {
  ...loginRequest,
  forceRefresh: false,
};

class AuthService {
  // @ts-ignore
  _instance: PublicClientApplication;
  // @ts-ignore
  _tokenPromise: Promise<AuthenticationResult | null> | null;
  // @ts-ignore
  _tokenMSGraphPromise: Promise<AuthenticationResult | null> | null;

  // @ts-ignore
  private static singleton: this;

  constructor() {
    if (AuthService.singleton) {
      return AuthService.singleton;
    }
    AuthService.singleton = this;
    this._instance = new PublicClientApplication(msalConfig);

    if (this.isAuthenticated) {
      this.instance.setActiveAccount(this.currentAccount);
    }
  }

  /**
   * Logs a userInfo in. A silent attempts is made first and then a redirect is
   * used as the fallback. No value is returned if the userInfo is redirected.
   */
  async login(): Promise<void> {
    // Attempt silent login
    if (await this.silentLogin()) {
      return;
    }
    // Login redirect
    await this.instance.loginRedirect(loginRequest);
  }

  /**
   * Method dto log the userInfo in silently by using the username stored in local
   * storage. This may fail if the userInfo does not have a session with the
   * authentication provider yet.
   * @returns True if login was successful, false otherwise
   */
  async silentLogin(): Promise<boolean> {
    const username: string | null = localStorage.getItem(AUTH_UPN_KEY);

    if (username === null) {
      return false;
    }
    const silentRequest: SsoSilentRequest = {
      ...tokenRequest,
      loginHint: username,
    };
    try {
      const response: AuthenticationResult = await this.instance.ssoSilent(
        silentRequest
      );
      return this.loginWithResponse(response);
    } catch (err) {
      this.logout();
    }
    return false;
  }

  /**
   * Sets the relevant data from a userInfo login response dto ensure the userInfo will
   * be recongized as logged in. This is mostly setting the username in local
   * storage.
   * @param {Object} response Response from the authentication provider
   * @returns True if login succeeds, false otherwise
   */
  loginWithResponse(response: AuthenticationResult): boolean {
    const username: string | undefined = response?.account?.username;

    if (username) {
      localStorage.setItem(AUTH_UPN_KEY, username);
      this.instance.setActiveAccount(this.currentAccount);

      return true;
    } else {
      console.error('Attempted dto log in with a null response.');
      return false;
    }
  }

  /**
   * Logs a userInfo out by unsetting the username from local storage.
   */
  logout(): void {
    const keysToRemove = [AUTH_UPN_KEY];

    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i) as string;

      if (
        key.startsWith('msal.') ||
        key.indexOf('-login.windows.net-') !== -1 ||
        key.indexOf('server-telemetry-') !== -1
      ) {
        keysToRemove.push(key);
      }
    }

    for (const key of keysToRemove) {
      localStorage.removeItem(key);
    }
  }

  /**
   * Retrieves a token for the userInfo dto make requests dto the backend. Multiple
   * calls dto this function will all use the same promise. If there is a token
   * available in cache that isn't expired that will be used. Otherwise a token
   * is fetched silently. if this fails the userInfo is redirected dto log in again.
   * @returns An access token or null of none is available
   */
  async getToken(): Promise<string | null | undefined> {
    if (!this.currentAccount) {
      // => not authenticated
      return null;
    }
    const silentRequest: SilentRequest = {
      ...tokenRequest,
      account: this.currentAccount,
    };
    try {
      if (!this._tokenPromise) {
        this._tokenPromise = this.instance.acquireTokenSilent(silentRequest);
      }
      const tokenResponse: AuthenticationResult | null = await this
        ._tokenPromise;
      if (tokenResponse) {
        this._tokenPromise = null;
        return tokenResponse.accessToken;
      }
    } catch (error) {
      this.logout();
      // force login redirect
      await this.login();
      return null;
    }
  }

  async getRoles(token: JwtTokenType) {
    const BCD_GROUPS_PREFIX = 'idm2bcd_gs-rvt_';

    return token.roles
      .map((role) => role.toLowerCase())
      .filter((role) => role.startsWith(BCD_GROUPS_PREFIX.toLowerCase()))
      .map((role) => role.replace(BCD_GROUPS_PREFIX.toLowerCase(), ''));
  }

  async isAdmin(): Promise<boolean> {
    const token = await new AuthService().getToken();
    const jwtToken = new JwtService().parseJwt(token);

    if (!jwtToken) {
      return false;
    }

    const validRoles = await this.getRoles(jwtToken);

    return validRoles[0] === 'admin';
  }

  async isAuthorized(): Promise<boolean> {
    const token = await new AuthService().getToken();
    const jwtToken = new JwtService().parseJwt(token);

    if (!jwtToken) {
      return false;
    }

    const BCD_GROUPS_PREFIX = 'idm2bcd_gs-rvt_';
    const validRoles = jwtToken.roles
      .map((role) => role.toLowerCase())
      .filter((role) => role.startsWith(BCD_GROUPS_PREFIX.toLowerCase()))
      .map((role) => role.replace(BCD_GROUPS_PREFIX.toLowerCase(), ''));

    return validRoles.length > 0;
  }

  async hasIdmRole(idmRoleToCheck: string): Promise<boolean> {
    const token = await new AuthService().getToken();
    const jwtAccessToken = new JwtService().parseJwt(token);

    if (!jwtAccessToken) {
      return false;
    }

    const roles = jwtAccessToken.roles;

    if (roles && Array.isArray(roles)) {
      const existingRoles = roles.filter((value) => value === idmRoleToCheck);
      return existingRoles.length > 0;
    }

    return false;
  }

  async getTokenMSGraph(): Promise<string | null | undefined> {
    if (!this.currentAccount) {
      // => not authenticated
      return null;
    }

    const request = {
      scopes: ['email', 'openid', 'profile', 'User.Read', 'User.Read.All'],
    };

    try {
      if (!this._tokenMSGraphPromise) {
        this._tokenMSGraphPromise = this.instance.acquireTokenSilent(request);
      }
      const tokenResponse: AuthenticationResult | null = await this
        ._tokenMSGraphPromise;
      if (tokenResponse) {
        this._tokenMSGraphPromise = null;
        return tokenResponse.accessToken;
      }
    } catch (error) {
      this.logout();
      // force login redirect
      await this.login();
      return null;
    }
  }

  /**
   * Returns true if the userInfo is authenticated. A userInfo is authenticated even if
   * their current token is expired. Authentication simply means that MSAL has
   * information about the userInfo.
   */
  get isAuthenticated(): boolean {
    return this.currentAccount !== null;
  }

  /**
   * Returns the current logged in account. In your app (and in most actually)
   * there will only be one account. The returned account object is generated
   * by MSAL and contains things like the claims from the ID token.
   */
  get currentAccount(): AccountInfo | null {
    const username: string | null = localStorage.getItem(AUTH_UPN_KEY);
    if (username === null) {
      return null;
    }
    return this._instance.getAccountByUsername(username);
  }

  get instance(): PublicClientApplication {
    return this._instance;
  }
}

export default AuthService;
