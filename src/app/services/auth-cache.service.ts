import { isPlatformBrowser } from "@angular/common";
import { HttpClient, type HttpResponse } from "@angular/common/http";
import { Injectable, PLATFORM_ID, computed, inject, signal } from "@angular/core";
import { AUTH_BASE_URL, type OAuthProvider, authCallbackUrl } from "@app/constants/api";
import type { ApiSession } from "@app/models";
import { firstValueFrom } from "rxjs";

export interface User {
  id: string;
  name: string;
  email: string;
  firstName: string;
  lastName: string;
  picture: string;
}

const TOKEN_STORAGE_KEY = "mm-auth-token";

const splitName = (name: string, email: string): { firstName: string; lastName: string } => {
  const trimmed = name?.trim();
  if (!trimmed) {
    return { firstName: email.split("@")[0] ?? "", lastName: "" };
  }
  const [firstName, ...rest] = trimmed.split(/\s+/);
  return { firstName, lastName: rest.join(" ") };
};

const toUser = (session: ApiSession | null): User | null => {
  if (!session?.user) return null;
  const { firstName, lastName } = splitName(session.user.name, session.user.email);
  return {
    id: session.user.id,
    name: session.user.name,
    email: session.user.email,
    firstName,
    lastName,
    picture: session.user.image ?? "",
  };
};

/**
 * Owns the Better Auth session for the application.
 *
 * The session lives in a cookie managed by the backend (sent with
 * `withCredentials: true`). A bearer token is also stored when the API
 * exposes one through the `set-auth-token` header, so the same session can be
 * replayed from environments where third-party cookies are unavailable.
 */
@Injectable({
  providedIn: "root",
})
export class AuthCacheService {
  private readonly http = inject(HttpClient);
  private readonly platformId = inject(PLATFORM_ID);
  private sessionRequest: Promise<User | null> | null = null;

  private readonly currentUser = signal<User | null>(null);
  private readonly loadingSession = signal(true);

  readonly user = this.currentUser.asReadonly();
  readonly loading = this.loadingSession.asReadonly();
  readonly isLoggedIn = computed(() => this.currentUser() !== null);

  constructor() {
    if (isPlatformBrowser(this.platformId)) {
      void this.ensureSession();
    } else {
      this.loadingSession.set(false);
    }
  }

  /**
   * Resolves the current session once and caches the result.
   */
  ensureSession(force = false): Promise<User | null> {
    if (!isPlatformBrowser(this.platformId)) {
      this.loadingSession.set(false);
      return Promise.resolve(null);
    }

    if (!force && this.sessionRequest) return this.sessionRequest;

    this.loadingSession.set(true);
    this.sessionRequest = this.fetchSession().finally(() => {
      this.loadingSession.set(false);
    });

    return this.sessionRequest;
  }

  private async fetchSession(): Promise<User | null> {
    try {
      const response = await firstValueFrom(
        this.http.get<ApiSession | null>(`${AUTH_BASE_URL}/get-session`, {
          observe: "response",
        }),
      );
      this.captureToken(response);
      const user = toUser(response.body);
      this.currentUser.set(user);
      return user;
    } catch {
      this.currentUser.set(null);
      return null;
    }
  }

  private captureToken(response: HttpResponse<unknown>): void {
    const token = response.headers.get("set-auth-token");
    if (!token) return;
    try {
      localStorage.setItem(TOKEN_STORAGE_KEY, token);
    } catch {
      // Storage can be unavailable in private browsing; cookies still work.
    }
  }

  /**
   * Starts the OAuth flow by navigating to the backend endpoint, which in turn
   * redirects to the provider. A full navigation is used instead of an XHR so
   * the provider's redirect chain and the session cookie are handled by the
   * browser.
   */
  login(provider: OAuthProvider): void {
    const callbackURL = encodeURIComponent(authCallbackUrl());
    window.location.assign(`${AUTH_BASE_URL}/${provider}?callbackURL=${callbackURL}`);
  }

  /**
   * Ends the session on the backend and clears the local cache.
   */
  async logout(): Promise<void> {
    try {
      await firstValueFrom(this.http.post(`${AUTH_BASE_URL}/sign-out`, {}));
    } catch {
      // The local session is cleared even if the network call fails.
    }

    this.clearToken();
    this.currentUser.set(null);
    this.sessionRequest = null;
  }

  private clearToken(): void {
    try {
      localStorage.removeItem(TOKEN_STORAGE_KEY);
    } catch {
      // Ignore storage errors.
    }
  }

  /**
   * Clears the local session cache.
   */
  clearUser(): void {
    this.clearToken();
    this.currentUser.set(null);
    this.sessionRequest = null;
  }
}
