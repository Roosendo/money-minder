import { isPlatformBrowser } from "@angular/common";
import { type HttpInterceptorFn } from "@angular/common/http";
import { PLATFORM_ID, inject } from "@angular/core";

const TOKEN_STORAGE_KEY = "mm-auth-token";

/**
 * Reads the Better Auth bearer token captured from the `set-auth-token`
 * response header. Returns null on the server and when no token is stored.
 */
const readToken = (): string | null => {
  if (typeof localStorage === "undefined") return null;
  return localStorage.getItem(TOKEN_STORAGE_KEY);
};

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const platformId = inject(PLATFORM_ID);
  const token = isPlatformBrowser(platformId) ? readToken() : null;

  const authReq = req.clone({
    withCredentials: true,
    setHeaders: token ? { Authorization: `Bearer ${token}` } : {},
  });

  return next(authReq);
};
