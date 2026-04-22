import { getCsrfToken, fetchAndStoreCsrfToken } from "@/lib/csrf";

// Define extended options interface with our custom properties
interface ApiOptions extends RequestInit {
  isRefreshAttempt?: boolean;
}

function resolveApiBaseUrl(): string {
  const envBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL?.trim();
  if (envBaseUrl) {
    return envBaseUrl.replace(/\/$/, "");
  }

  if (typeof window !== "undefined") {
    const { protocol, hostname } = window.location;
    return `${protocol}//${hostname}:4000/api`;
  }

  return (process.env.BACKEND_URL || "http://localhost:4000/api").replace(/\/$/, "");
}

function normalizePath(path: string): string {
  return path.startsWith("/") ? path : `/${path}`;
}

export const API_BASE_URL = resolveApiBaseUrl();
export async function apiFetch(path: string, options: ApiOptions = {}) {
  const baseUrl = resolveApiBaseUrl();
  const normalizedPath = normalizePath(path);
  // Create headers object with proper typing
  const headers = new Headers(options.headers || {});

  // Always set Content-Type for non-GET requests
  if (
    ((options.method && options.method !== 'GET') || options.body) &&
    !headers.has("Content-Type")
  ) {
    headers.set("Content-Type", "application/json");
  }

  // Add CSRF token for mutating requests (but make it optional in development)
  const csrfToken = getCsrfToken();
  if (csrfToken && options.method && ["POST", "PUT", "DELETE"].includes(options.method.toUpperCase())) {
    headers.set("x-csrf-token", csrfToken);
  } else if (options.method && ["POST", "PUT", "DELETE"].includes(options.method.toUpperCase())) {
    // If no CSRF token available, log a warning but don't fail
    console.warn(`No CSRF token available for ${options.method} request to ${path}`);
  }

  // Set CORS headers required by backend (for fetch, these are set by browser, but for clarity):
  headers.set("Accept", "application/json");

  // Always set credentials: 'include' unless explicitly overridden
  const fetchOptions: RequestInit = {
    ...options,
    headers,
    credentials: options.credentials || 'include',
  };

  const triedRefresh = false;
  while (true) {
    try {
     // console.log(`Making API request to: ${baseUrl}${normalizedPath}`);
      const response = await fetch(`${baseUrl}${normalizedPath}`, fetchOptions);
     // console.log(`API Response from ${path}: Status ${response.status}`);

      // Handle 401 errors
      if (response.status === 401) {
        // Try token refresh if not already attempting it
        if (!options.isRefreshAttempt) {
          try {
            const refreshed = await refreshTokens();
            if (refreshed) {
              // Retry original request with new tokens - fix: use path instead of endpoint
              return apiFetch(normalizedPath, { ...options, isRefreshAttempt: true });
            }
          } catch (refreshError) {
            console.error('Error refreshing token:', refreshError);
          }
        }
        
        // Clear session data
        if (typeof window !== 'undefined') {
          // Use session storage clear instead of localStorage to preserve other app data
          window.sessionStorage?.removeItem('userSession');

          // mark signin/login/register as public
          const isPublicRoute = /^\/(login|signin|register|$)/.test(window.location.pathname);

          if (!isPublicRoute) {
            // Build redirect URL with original path
            const currentPath = window.location.pathname + window.location.search
            const redirectUrl = `/signin?expired=true&redirect=${encodeURIComponent(currentPath)}`;
            // Force navigation (not pushState) so app resets cleanly
            window.location.href = redirectUrl;
          }
        }
        
        // Use a more user-friendly error for UI display
        throw new Error('Your session has expired. Please sign in again to continue.');
      }

      if (response.status === 403) {
        if(response?.statusText === "Forbidden") {
          throw new Error(`Access forbidden. You don't have permission to access this resource.`);
        }
        // CSRF failure - try to fetch new token and suggest retry
        console.warn("CSRF token validation failed, attempting to refresh token");
        try {
          await fetchAndStoreCsrfToken();
          throw new Error("Security token expired. Please try your request again.");
        } catch (csrfError) {
          throw new Error("Your session has expired. Please refresh the page and try again.");
        }
      }

      return response;
    } catch (err) {
      console.error(`Network error in apiFetch to ${path}:`, err);
      throw err;
    }
  }
}

// Add missing refreshTokens function if it doesn't exist elsewhere
async function refreshTokens(): Promise<boolean> {
  try {
    const baseUrl = resolveApiBaseUrl();
    const response = await fetch(`${baseUrl}/auth/refresh-token`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    if (response.ok) {
      return true;
    }
    return false;
  } catch (error) {
    console.error("Error refreshing tokens:", error);
    return false;
  }
}

export {};
