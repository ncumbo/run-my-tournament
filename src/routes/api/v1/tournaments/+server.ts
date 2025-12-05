import { json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";
import {
  tournamentOperations,
  organizationOperations,
} from "$lib/server/customerDatabase";

export const GET: RequestHandler = async ({ url, request }) => {
  try {
    // Extract API key from Authorization header
    const authHeader = request.headers.get("Authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return json({ error: "API key required" }, { status: 401 });
    }

    const apiKey = authHeader.substring(7);

    // TODO: Validate API key and get organization
    // For now, we'll use a mock organization ID
    const organizationId = "mock-org-id";

    // Get query parameters
    const status = url.searchParams.get("status") || undefined;
    const limit = parseInt(url.searchParams.get("limit") || "50");
    const offset = parseInt(url.searchParams.get("offset") || "0");

    // Get tournaments for organization
    let tournaments =
      tournamentOperations.getOrganizationTournaments(organizationId);

    // Filter by status if provided
    if (status) {
      tournaments = tournaments.filter((t) => t.status === status);
    }

    // Apply pagination
    const total = tournaments.length;
    const paginatedTournaments = tournaments.slice(offset, offset + limit);

    // Format response
    const response = {
      data: paginatedTournaments.map((tournament) => ({
        id: tournament.id,
        name: tournament.name,
        slug: tournament.slug,
        event_date: tournament.event_date,
        location: {
          name: tournament.location_name,
          address: tournament.location_address,
          city: tournament.location_city,
          state: tournament.location_state,
          zip: tournament.location_zip,
        },
        pricing: {
          individual_price: tournament.individual_price,
          team_price: tournament.team_price,
        },
        registration: {
          max_participants: tournament.max_participants,
          registration_deadline: tournament.registration_deadline,
        },
        settings: {
          charity_name: tournament.charity_name,
          charity_description: tournament.charity_description,
          sponsors_enabled: tournament.sponsors_enabled,
          leaderboard_enabled: tournament.leaderboard_enabled,
        },
        status: tournament.status,
        created_at: tournament.created_at,
        updated_at: tournament.updated_at,
      })),
      pagination: {
        total,
        limit,
        offset,
        has_more: offset + limit < total,
      },
    };

    return json(response);
  } catch (error) {
    console.error("API Error:", error);
    return json({ error: "Internal server error" }, { status: 500 });
  }
};

export const POST: RequestHandler = async ({ request }) => {
  try {
    const authHeader = request.headers.get("Authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return json({ error: "API key required" }, { status: 401 });
    }

    const apiKey = authHeader.substring(7);
    const organizationId = "mock-org-id"; // TODO: Get from API key

    const tournamentData = await request.json();

    // Validate required fields
    const required = ["name", "slug", "event_date", "individual_price"];
    for (const field of required) {
      if (!tournamentData[field]) {
        return json(
          { error: `Missing required field: ${field}` },
          { status: 400 }
        );
      }
    }

    // Create tournament
    const newTournament = tournamentOperations.createTournament({
      organization_id: organizationId,
      name: tournamentData.name,
      slug: tournamentData.slug,
      event_date: tournamentData.event_date,
      location_name: tournamentData.location?.name,
      location_address: tournamentData.location?.address,
      location_city: tournamentData.location?.city,
      location_state: tournamentData.location?.state,
      location_zip: tournamentData.location?.zip,
      individual_price:
        tournamentData.pricing?.individual_price ||
        tournamentData.individual_price,
      team_price: tournamentData.pricing?.team_price,
      max_participants: tournamentData.registration?.max_participants,
      registration_deadline: tournamentData.registration?.registration_deadline,
      hero_image_url: tournamentData.hero_image_url,
      description: tournamentData.description,
      theme_template: tournamentData.theme_template || "classic",
      custom_css: tournamentData.custom_css,
      charity_name: tournamentData.settings?.charity_name,
      charity_description: tournamentData.settings?.charity_description,
      sponsors_enabled: tournamentData.settings?.sponsors_enabled ?? true,
      leaderboard_enabled: tournamentData.settings?.leaderboard_enabled ?? true,
      status: tournamentData.status || "draft",
    });

    return json(
      {
        data: {
          id: newTournament.id,
          message: "Tournament created successfully",
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("API Error:", error);
    return json({ error: "Internal server error" }, { status: 500 });
  }
};
