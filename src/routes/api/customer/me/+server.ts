import { json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";

export const GET: RequestHandler = async ({ request, cookies }) => {
  try {
    // For demo purposes, return a mock user to prevent dashboard spinning
    // In production, this should validate actual sessions

    const mockUser = {
      id: "demo-user-123",
      email: "demo@example.com",
      first_name: "Demo",
      last_name: "User",
      phone: null,
      profile_image_url: null,
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
      custom_domain: null,
      logo_url: null,
      primary_color: "#198038",
    };

    return json({
      success: true,
      user: mockUser,
      organization: mockOrganization,
      organizations: [mockOrganization],
    });
  } catch (error) {
    console.error("Get user error:", error);
    return json({ success: false, error: "Server error" }, { status: 500 });
  }
};
