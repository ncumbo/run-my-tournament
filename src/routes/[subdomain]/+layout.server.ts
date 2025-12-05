import type { LayoutServerLoad } from "./$types";
import {
  organizationOperations,
  tournamentOperations,
} from "$lib/server/customerDatabase";
import { error } from "@sveltejs/kit";

export const load: LayoutServerLoad = async ({ params, url }) => {
  const subdomain = params.subdomain;

  if (!subdomain) {
    throw error(404, "Subdomain not found");
  }

  // Get organization by subdomain
  const organization =
    organizationOperations.getOrganizationBySubdomain(subdomain);

  if (!organization) {
    throw error(404, "Organization not found");
  }

  // Get organization's tournaments
  const tournaments = tournamentOperations.getOrganizationTournaments(
    organization.id
  );

  return {
    organization: {
      id: organization.id,
      name: organization.name,
      subdomain: organization.subdomain,
      custom_domain: organization.custom_domain,
      logo_url: organization.logo_url,
      primary_color: organization.primary_color,
      secondary_color: organization.secondary_color,
      font_family: organization.font_family,
    },
    tournaments: tournaments
      .filter((t) => t.status === "published")
      .map((tournament) => ({
        id: tournament.id,
        name: tournament.name,
        slug: tournament.slug,
        event_date: tournament.event_date,
        location_name: tournament.location_name,
        location_city: tournament.location_city,
        location_state: tournament.location_state,
        individual_price: tournament.individual_price,
        team_price: tournament.team_price,
        max_participants: tournament.max_participants,
        registration_deadline: tournament.registration_deadline,
        hero_image_url: tournament.hero_image_url,
        description: tournament.description,
        theme_template: tournament.theme_template,
        custom_css: tournament.custom_css,
        charity_name: tournament.charity_name,
        charity_description: tournament.charity_description,
        sponsors_enabled: tournament.sponsors_enabled,
        leaderboard_enabled: tournament.leaderboard_enabled,
      })),
  };
};
