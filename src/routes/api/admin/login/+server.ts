import { json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";
import { adminOperations } from "$lib/server/database";

export const POST: RequestHandler = async ({ request }) => {
  try {
    const { email, password } = await request.json();

    // Validate input
    if (!email || !password) {
      return json(
        { success: false, error: "Email and password are required" },
        { status: 400 }
      );
    }

    // Get admin user by email
    const admin = adminOperations.getAdminByEmail(email);

    if (!admin) {
      return json(
        { success: false, error: "Invalid email or password" },
        { status: 401 }
      );
    }

    // Verify password
    const isValidPassword = adminOperations.verifyPassword(
      password,
      admin.password_hash
    );

    if (!isValidPassword) {
      return json(
        { success: false, error: "Invalid email or password" },
        { status: 401 }
      );
    }

    // Update last login
    adminOperations.updateLastLogin(admin.id);

    // Return user data (excluding password hash)
    const { password_hash, ...userWithoutPassword } = admin;

    return json({
      success: true,
      user: {
        id: userWithoutPassword.id.toString(),
        email: userWithoutPassword.email,
        name: userWithoutPassword.name,
        role: userWithoutPassword.role,
        created_at: userWithoutPassword.created_at,
        last_login: userWithoutPassword.last_login,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    return json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
};
