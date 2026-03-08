import { Navbar } from "./components/navbar";
import { cookies } from "next/headers";
import { db } from "@/lib/db";
import { users } from "@/lib/schema";
import { eq } from "drizzle-orm";

export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const cookieStore = await cookies();
    const userId = cookieStore.get("userId")?.value;

    let userName = "User";
    if (userId) {
        const userOpt = await db.select({ name: users.name }).from(users).where(eq(users.id, userId)).get();
        if (userOpt && userOpt.name) {
            userName = userOpt.name;
        }
    }

    return (
        <div className="flex flex-col min-h-screen">
            <Navbar userName={userName} />
            <main className="flex-1 p-6 max-w-7xl mx-auto w-full">
                {children}
            </main>
        </div>
    );
}
