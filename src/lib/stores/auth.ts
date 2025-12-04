import { writable } from "svelte/store";
import { browser } from "$app/environment";

interface User {
  id: string;
  email: string;
  name: string;
  role: "admin" | "super_admin";
  created_at?: string;
  last_login?: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
};

// Load initial state from localStorage if in browser
function getInitialState(): AuthState {
  if (!browser) return initialState;

  try {
    const stored = localStorage.getItem("auth");
    if (stored) {
      const parsed = JSON.parse(stored);
      return {
        ...initialState,
        ...parsed,
        isAuthenticated: !!parsed.user,
      };
    }
  } catch (error) {
    console.error("Failed to parse stored auth state:", error);
  }

  return initialState;
}

export const auth = writable<AuthState>(getInitialState());

export const authActions = {
  async login(
    email: string,
    password: string
  ): Promise<{ success: boolean; error?: string }> {
    auth.update((state) => ({ ...state, isLoading: true }));

    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const result = await response.json();

      if (result.success && result.user) {
        const authUser: User = {
          id: result.user.id,
          email: result.user.email,
          name: result.user.name,
          role: result.user.role,
          created_at: result.user.created_at,
          last_login: result.user.last_login,
        };

        const newState: AuthState = {
          user: authUser,
          isAuthenticated: true,
          isLoading: false,
        };

        auth.set(newState);

        // Store in localStorage
        if (browser) {
          localStorage.setItem("auth", JSON.stringify(newState));
        }

        return { success: true };
      } else {
        auth.update((state) => ({ ...state, isLoading: false }));
        return { success: false, error: result.error || "Login failed" };
      }
    } catch (error) {
      console.error("Login error:", error);
      auth.update((state) => ({ ...state, isLoading: false }));
      return { success: false, error: "Network error. Please try again." };
    }
  },

  async register(
    email: string,
    password: string,
    name: string,
    role: "admin" | "super_admin" = "admin"
  ): Promise<{ success: boolean; error?: string }> {
    auth.update((state) => ({ ...state, isLoading: true }));

    try {
      const response = await fetch("/api/admin/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password, name, role }),
      });

      const result = await response.json();

      if (result.success && result.user) {
        const authUser: User = {
          id: result.user.id,
          email: result.user.email,
          name: result.user.name,
          role: result.user.role,
          created_at: result.user.created_at,
        };

        const newState: AuthState = {
          user: authUser,
          isAuthenticated: true,
          isLoading: false,
        };

        auth.set(newState);

        // Store in localStorage
        if (browser) {
          localStorage.setItem("auth", JSON.stringify(newState));
        }

        return { success: true };
      } else {
        auth.update((state) => ({ ...state, isLoading: false }));
        return { success: false, error: result.error || "Registration failed" };
      }
    } catch (error) {
      console.error("Registration error:", error);
      auth.update((state) => ({ ...state, isLoading: false }));
      return { success: false, error: "Network error. Please try again." };
    }
  },

  logout(): void {
    auth.set(initialState);
    if (browser) {
      localStorage.removeItem("auth");
    }
  },
};
