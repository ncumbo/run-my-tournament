import { json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";
import { organizationOperations } from "$lib/server/customerDatabase";

export const PUT: RequestHandler = async ({ request, cookies }) => {
  try {
    const {
      name,
      primary_color,
      secondary_color,
      font_family,
      logo_url,
      custom_css,
    } = await request.json();

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

    // Update organization
    const result = organizationOperations.updateOrganization(organizationId, {
      name,
      primary_color,
      secondary_color,
      font_family,
      logo_url,
    });

    if (!result) {
      return json(
        { success: false, error: "Failed to update organization" },
        { status: 500 }
      );
    }

    // TODO: Store custom_css in a separate table or field

    return json({
      success: true,
      message: "Customization updated successfully",
    });
  } catch (error) {
    console.error("Customization update error:", error);
    return json({ success: false, error: "Server error" }, { status: 500 });
  }
};
