import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { users } from "@/lib/schema";
import { hashPassword, generateId } from "@/lib/auth";
import { eq } from "drizzle-orm";

export async function POST(request: NextRequest) {
  try {
    const { email, password, name } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password required" },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .get();

    if (existingUser) {
      return NextResponse.json(
        { error: "User already exists" },
        { status: 409 }
      );
    }

    // Create new user
    const userId = generateId();
    const passwordHash = hashPassword(password);

    db.insert(users).values({
      id: userId,
      email,
      password_hash: passwordHash,
      name: name || email,
      created_at: new Date(),
    }).run();

    return NextResponse.json(
      { message: "User created successfully", userId },
      { status: 201 }
    );
  } catch (error) {
    console.error("Register error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
