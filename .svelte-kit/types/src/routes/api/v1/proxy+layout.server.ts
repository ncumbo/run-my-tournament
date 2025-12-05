// @ts-nocheck
import type { LayoutServerLoad } from "./$types";
import { error } from "@sveltejs/kit";

export const load = async ({ request }: Parameters<LayoutServerLoad>[0]) => {
  const authHeader = request.headers.get("Authorization");

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw error(401, "API key required");
  }

  const apiKey = authHeader.substring(7); // Remove "Bearer "

  // TODO: Validate API key against database
  // For now, we'll use a simple validation
  if (!apiKey || apiKey.length < 32) {
    throw error(401, "Invalid API key");
  }

  return {
    apiKey,
  };
};
