import { db } from "./src/lib/db";
import { users } from "./src/lib/schema";
import { hashPassword, generateId } from "./src/lib/auth";

function seed() {
  console.log("🌱 Seeding database...");

  try {
    // Create test users
    const testUsers = [
      {
        email: "mahasiswa@example.com",
        password: "password123",
        name: "Muhammad Rizki",
      },
      {
        email: "dosen@example.com",
        password: "password123",
        name: "Dr. Ahmad Kurnia",
      },
      {
        email: "admin@example.com",
        password: "admin123",
        name: "Admin User",
      },
    ];

    for (const testUser of testUsers) {
      const existingUser = db.query.users.findFirst({
        where: (users, { eq }) => eq(users.email, testUser.email),
      });

      if (!existingUser) {
        db.insert(users).values({
          id: generateId(),
          email: testUser.email,
          password_hash: hashPassword(testUser.password),
          name: testUser.name,
          created_at: new Date(),
        }).run();

        console.log(
          `✅ Created user: ${testUser.email} (Password: ${testUser.password})`
        );
      } else {
        console.log(`⏭️  User already exists: ${testUser.email}`);
      }
    }

    console.log("✨ Seeding completed!");
  } catch (error) {
    console.error("❌ Seeding failed:", error);
    process.exit(1);
  }
}

seed();
