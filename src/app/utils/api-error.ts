import { HttpErrorResponse } from "@angular/common/http";

interface ApiErrorBody {
  message?: string | string[];
}

/**
 * Normalizes the NestJS error shape (`message` may be a string or an array)
 * so components can render one readable sentence.
 */
export const extractApiErrorMessage = (
  error: unknown,
  fallback = "Ocurrió un error inesperado. Intenta de nuevo.",
): string => {
  if (error instanceof HttpErrorResponse) {
    const body = error.error as ApiErrorBody | string | null;

    if (typeof body === "string" && body.trim()) return body;

    if (body && typeof body === "object") {
      const { message } = body;

      if (Array.isArray(message)) {
        const joined = message.filter(Boolean).join(", ");
        if (joined) return joined;
      }

      if (typeof message === "string" && message.trim()) return message;
    }

    return error.message || fallback;
  }

  if (error instanceof Error && error.message) return error.message;

  return fallback;
};
