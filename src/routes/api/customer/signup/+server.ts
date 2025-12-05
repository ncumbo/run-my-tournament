import { json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";
import {
  customerUserOperations,
  organizationOperations,
  userRoleOperations,
} from "$lib/server/customerDatabase";

export const POST: RequestHandler = async ({ request }) => {
  try {
    const { email, password, first_name, last_name, organization_name, phone } =
      await request.json();

    // Validation
    if (
      !email ||
      !password ||
      !first_name ||
      !last_name ||
      !organization_name
    ) {
      return json(
        { success: false, error: "All required fields must be provided" },
        { status: 400 }
      );
    }

    if (password.length < 8) {
      return json(
        {
          success: false,
          error: "Password must be at least 8 characters long",
        },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = customerUserOperations.getUserByEmail(email);
    if (existingUser) {
      return json(
        { success: false, error: "An account with this email already exists" },
        { status: 409 }
      );
    }

    try {
      // Create user
      const userResult = customerUserOperations.createUser(
        email,
        password,
        first_name,
        last_name,
        phone
      );

      // Create organization
      const orgResult = organizationOperations.createOrganization(
        userResult.id,
        organization_name
      );

      // Grant owner role
      userRoleOperations.grantRole(
        userResult.id,
        orgResult.id,
        "owner",
        ["*"] // Full permissions
      );

      // Update last login
      customerUserOperations.updateLastLogin(userResult.id);

      // Get created user and organization
      const user = customerUserOperations.getUserById(userResult.id);
      const organization = organizationOperations.getOrganizationById(
        orgResult.id
      );

      if (!user || !organization) {
        throw new Error("Failed to retrieve created user or organization");
      }

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
          organization_id: organization.id,
          organization_name: organization.name,
          organization_subdomain: organization.subdomain,
        },
        organization: {
          id: organization.id,
          name: organization.name,
          subdomain: organization.subdomain,
          custom_domain: organization.custom_domain,
          logo_url: organization.logo_url,
          primary_color: organization.primary_color,
        },
        message:
          "Account created successfully! Please check your email to verify your account.",
      });
    } catch (dbError) {
      console.error("Database error during signup:", dbError);
      return json(
        {
          success: false,
          error: "Failed to create account. Please try again.",
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Signup error:", error);
    return json(
      { success: false, error: "Invalid request format" },
      { status: 400 }
    );
  }
};
