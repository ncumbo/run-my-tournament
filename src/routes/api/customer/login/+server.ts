import { json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";
import {
  customerUserOperations,
  organizationOperations,
} from "$lib/server/customerDatabase";

export const POST: RequestHandler = async ({ request }) => {
  try {
    const { email, password } = await request.json();

    // Validation
    if (!email || !password) {
      return json(
        { success: false, error: "Email and password are required" },
        { status: 400 }
      );
    }

    // Get user by email
    const user = customerUserOperations.getUserByEmail(email);
    if (!user) {
      return json(
        { success: false, error: "Invalid email or password" },
        { status: 401 }
      );
    }

    // Verify password
    const isValidPassword = customerUserOperations.verifyPassword(
      password,
      user.password_hash
    );
    if (!isValidPassword) {
      return json(
        { success: false, error: "Invalid email or password" },
        { status: 401 }
      );
    }

    // Update last login
    customerUserOperations.updateLastLogin(user.id);

    // Get user's organizations
    const organizations = organizationOperations.getUserOrganizations(user.id);
    const primaryOrg = organizations[0] || null;

    // Remove sensitive data
    const {
      password_hash,
      email_verification_token,
      password_reset_token,
      ...safeUser
    } = user;

    return json({
      success: true,
      user: {
        ...safeUser,
        organization_id: primaryOrg?.id,
        organization_name: primaryOrg?.name,
        organization_subdomain: primaryOrg?.subdomain,
      },
      organization: primaryOrg
        ? {
            id: primaryOrg.id,
            name: primaryOrg.name,
            subdomain: primaryOrg.subdomain,
            custom_domain: primaryOrg.custom_domain,
            logo_url: primaryOrg.logo_url,
            primary_color: primaryOrg.primary_color,
          }
        : null,
      organizations: organizations.map((org) => ({
        id: org.id,
        name: org.name,
        subdomain: org.subdomain,
        custom_domain: org.custom_domain,
      })),
    });
  } catch (error) {
    console.error("Login error:", error);
    return json(
      { success: false, error: "Invalid request format" },
      { status: 400 }
    );
  }
};
