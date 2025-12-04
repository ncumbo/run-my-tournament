import { json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";
import { adminOperations } from "$lib/server/database";

export const POST: RequestHandler = async ({ request }) => {
  try {
    const { name, email, password, role } = await request.json();

    // Validate input
    if (!name || !email || !password) {
      return json(
        { success: false, error: "Name, email, and password are required" },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return json(
        { success: false, error: "Please enter a valid email address" },
        { status: 400 }
      );
    }

    // Validate password length
    if (password.length < 6) {
      return json(
        { success: false, error: "Password must be at least 6 characters" },
        { status: 400 }
      );
    }

    // Check if admin already exists
    const existingAdmin = adminOperations.getAdminByEmail(email);
    if (existingAdmin) {
      return json(
        { success: false, error: "An admin with this email already exists" },
        { status: 409 }
      );
    }

    // Create new admin
    const result = adminOperations.createAdmin(
      name,
      email,
      password,
      role || "admin"
    );

    if (!result || !result.lastInsertRowid) {
      return json(
        { success: false, error: "Failed to create admin account" },
        { status: 500 }
      );
    }

    // Get the created admin
    const newAdmin = adminOperations.getAdminById(
      Number(result.lastInsertRowid)
    );

    if (!newAdmin) {
      return json(
        { success: false, error: "Failed to retrieve created admin account" },
        { status: 500 }
      );
    }

    // Return user data (excluding password hash)
    return json({
      success: true,
      user: {
        id: newAdmin.id.toString(),
        email: newAdmin.email,
        name: newAdmin.name,
        role: newAdmin.role,
        created_at: newAdmin.created_at,
      },
      message: "Admin account created successfully",
    });
  } catch (error) {
    console.error("Registration error:", error);
    return json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
};
