/**
 * Money Minder API configuration.
 *
 * The NestJS backend exposes every business endpoint under the global
 * `api/v1` prefix. Better Auth lives under `api/v1/auth`.
 *
 * To point the app at a locally running backend, change `API_ORIGIN` to
 * `http://localhost:7373`. The backend CORS config already allows
 * `http://localhost:4200`.
 * If not, it's "https://money-minder-api-mqz9.onrender.com"
 */
export const API_ORIGIN = "https://money-minder-api-mqz9.onrender.com";

export const API_BASE_URL = `${API_ORIGIN}/api/v1`;

export const AUTH_BASE_URL = `${API_BASE_URL}/auth`;

/**
 * OAuth providers enabled on the Better Auth instance.
 */
export type OAuthProvider = "google" | "github";

/**
 * The page Better Auth sends the user back to after the OAuth callback.
 * It must be present in the backend `trustedOrigins` list.
 */
export const authCallbackUrl = (): string => `${window.location.origin}/login`;
