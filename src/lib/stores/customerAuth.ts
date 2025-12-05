import { writable } from "svelte/store";
import { browser } from "$app/environment";

export interface CustomerUser {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  phone?: string;
  profile_image_url?: string;
  organization_id?: string;
  organization_name?: string;
  organization_subdomain?: string;
  email_verified: boolean;
  created_at: string;
  last_login_at?: string;
}

export interface CustomerAuthState {
  user: CustomerUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  organization: {
    id?: string;
    name?: string;
    subdomain?: string;
    custom_domain?: string;
    logo_url?: string;
    primary_color?: string;
  } | null;
}

const initialState: CustomerAuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
  organization: null,
};

// Load initial state from localStorage if in browser
function getInitialState(): CustomerAuthState {
  if (!browser) return initialState;

  try {
    const stored = localStorage.getItem("customerAuth");
    if (stored) {
      const parsed = JSON.parse(stored);
      return {
        ...initialState,
        ...parsed,
        isAuthenticated: !!parsed.user,
      };
    }
  } catch (error) {
    console.error("Failed to parse stored customer auth state:", error);
  }

  return initialState;
}

export const customerAuth = writable<CustomerAuthState>(getInitialState());

export const customerAuthActions = {
  async signup(
    email: string,
    password: string,
    firstName: string,
    lastName: string,
    organizationName: string,
    phone?: string
  ): Promise<{ success: boolean; error?: string }> {
    customerAuth.update((state) => ({ ...state, isLoading: true }));

    try {
      const response = await fetch("/api/customer/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
          first_name: firstName,
          last_name: lastName,
          organization_name: organizationName,
          phone,
        }),
      });

      const result = await response.json();

      if (result.success && result.user && result.organization) {
        const newState: CustomerAuthState = {
          user: result.user,
          isAuthenticated: true,
          isLoading: false,
          organization: result.organization,
        };

        customerAuth.set(newState);

        // Store in localStorage
        if (browser) {
          localStorage.setItem("customerAuth", JSON.stringify(newState));
        }

        return { success: true };
      } else {
        customerAuth.update((state) => ({ ...state, isLoading: false }));
        return { success: false, error: result.error || "Signup failed" };
      }
    } catch (error) {
      console.error("Signup error:", error);
      customerAuth.update((state) => ({ ...state, isLoading: false }));
      return { success: false, error: "Network error. Please try again." };
    }
  },

  async login(
    email: string,
    password: string
  ): Promise<{ success: boolean; error?: string }> {
    customerAuth.update((state) => ({ ...state, isLoading: true }));

    try {
      // For demo purposes, accept any login and return mock data
      // In production, this would validate against the actual API

      const mockUser: CustomerUser = {
        id: "demo-user-123",
        email: email,
        first_name: "Demo",
        last_name: "User",
        phone: undefined,
        profile_image_url: undefined,
        organization_id: "demo-org-123",
        organization_name: "Demo Organization",
        organization_subdomain: "demo-org",
        email_verified: true,
        created_at: new Date().toISOString(),
        last_login_at: new Date().toISOString(),
      };

      const mockOrganization = {
        id: "demo-org-123",
        name: "Demo Organization",
        subdomain: "demo-org",
        custom_domain: undefined,
        logo_url: undefined,
        primary_color: "#198038",
      };

      const newState: CustomerAuthState = {
        user: mockUser,
        isAuthenticated: true,
        isLoading: false,
        organization: mockOrganization,
      };

      customerAuth.set(newState);

      // Store in localStorage
      if (browser) {
        localStorage.setItem("customerAuth", JSON.stringify(newState));
      }

      return { success: true };
    } catch (error) {
      console.error("Login error:", error);
      customerAuth.update((state) => ({ ...state, isLoading: false }));
      return { success: false, error: "Network error. Please try again." };
    }
  },

  async requestPasswordReset(
    email: string
  ): Promise<{ success: boolean; error?: string }> {
    try {
      const response = await fetch("/api/customer/password-reset", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const result = await response.json();
      return { success: result.success, error: result.error };
    } catch (error) {
      console.error("Password reset error:", error);
      return { success: false, error: "Network error. Please try again." };
    }
  },

  async verifyEmail(
    token: string
  ): Promise<{ success: boolean; error?: string }> {
    try {
      const response = await fetch("/api/customer/verify-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token }),
      });

      const result = await response.json();

      if (result.success && result.user) {
        customerAuth.update((state) => ({
          ...state,
          user: result.user,
        }));

        // Update localStorage
        if (browser) {
          const stored = localStorage.getItem("customerAuth");
          if (stored) {
            const parsed = JSON.parse(stored);
            parsed.user = result.user;
            localStorage.setItem("customerAuth", JSON.stringify(parsed));
          }
        }
      }

      return { success: result.success, error: result.error };
    } catch (error) {
      console.error("Email verification error:", error);
      return { success: false, error: "Network error. Please try again." };
    }
  },

  async updateProfile(
    updates: Partial<CustomerUser>
  ): Promise<{ success: boolean; error?: string }> {
    try {
      const response = await fetch("/api/customer/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updates),
      });

      const result = await response.json();

      if (result.success && result.user) {
        customerAuth.update((state) => ({
          ...state,
          user: result.user,
        }));

        // Update localStorage
        if (browser) {
          const stored = localStorage.getItem("customerAuth");
          if (stored) {
            const parsed = JSON.parse(stored);
            parsed.user = result.user;
            localStorage.setItem("customerAuth", JSON.stringify(parsed));
          }
        }
      }

      return { success: result.success, error: result.error };
    } catch (error) {
      console.error("Profile update error:", error);
      return { success: false, error: "Network error. Please try again." };
    }
  },

  logout(): void {
    customerAuth.set(initialState);
    if (browser) {
      localStorage.removeItem("customerAuth");
    }
  },

  async refreshAuth(): Promise<void> {
    if (!browser) return;

    try {
      const response = await fetch("/api/customer/me", {
        method: "GET",
        credentials: "include",
      });

      if (response.ok) {
        const result = await response.json();
        if (result.success && result.user) {
          customerAuth.update((state) => ({
            ...state,
            user: result.user,
            organization: result.organization || state.organization,
            isAuthenticated: true,
          }));
        }
      } else {
        // Don't automatically logout on refresh failure
        console.log("Auth refresh failed, but keeping current session");
      }
    } catch (error) {
      console.log("Auth refresh error (non-critical):", error);
      // Don't logout on network errors
    }
  },
};
