import { json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";
import { organizationOperations } from "$lib/server/customerDatabase";

export const PUT: RequestHandler = async ({ request, cookies }) => {
  try {
    const { subdomain, custom_domain, action } = await request.json();

    // Get session (simplified - in production use proper JWT)
    const sessionCookie = cookies.get("customer_session");
    if (!sessionCookie) {
      return json(
        { success: false, error: "Not authenticated" },
        { status: 401 }
      );
    }

    let userId: string | null = null;
    let organizationId: string | null = null;

    try {
      const sessionData = JSON.parse(atob(sessionCookie));
      userId = sessionData.userId;
      organizationId = sessionData.organizationId;
    } catch (e) {
      return json(
        { success: false, error: "Invalid session" },
        { status: 401 }
      );
    }

    if (!userId || !organizationId) {
      return json(
        { success: false, error: "Invalid session" },
        { status: 401 }
      );
    }

    let updateData: any = {};

    switch (action) {
      case "update_subdomain":
        if (!subdomain || subdomain.length < 3) {
          return json(
            {
              success: false,
              error: "Subdomain must be at least 3 characters",
            },
            { status: 400 }
          );
        }

        // Check if subdomain is available
        const existingOrg =
          organizationOperations.getOrganizationBySubdomain(subdomain);
        if (existingOrg && existingOrg.id !== organizationId) {
          return json(
            { success: false, error: "Subdomain is already taken" },
            { status: 409 }
          );
        }

        updateData = { subdomain };
        break;

      case "add_custom_domain":
        if (!custom_domain) {
          return json(
            { success: false, error: "Custom domain is required" },
            { status: 400 }
          );
        }

        // Basic domain validation
        const domainRegex =
          /^[a-zA-Z0-9]([a-zA-Z0-9\-]{0,61}[a-zA-Z0-9])?(\.[a-zA-Z0-9]([a-zA-Z0-9\-]{0,61}[a-zA-Z0-9])?)*$/;
        if (!domainRegex.test(custom_domain)) {
          return json(
            { success: false, error: "Invalid domain format" },
            { status: 400 }
          );
        }

        updateData = { custom_domain };
        break;

      case "remove_custom_domain":
        updateData = { custom_domain: null };
        break;

      default:
        return json(
          { success: false, error: "Invalid action" },
          { status: 400 }
        );
    }

    const result = organizationOperations.updateOrganization(
      organizationId,
      updateData
    );

    if (!result) {
      return json(
        { success: false, error: "Failed to update domain settings" },
        { status: 500 }
      );
    }

    return json({
      success: true,
      message: "Domain settings updated successfully",
    });
  } catch (error) {
    console.error("Domain update error:", error);
    return json({ success: false, error: "Server error" }, { status: 500 });
  }
};
