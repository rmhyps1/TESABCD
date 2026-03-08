"use server";

import { cookies } from "next/headers";
import { db } from "@/lib/db";
import { tasks } from "@/lib/schema";
import { eq, asc, and, lte, gte } from "drizzle-orm";

export async function getDeadlinesAction() {
    try {
        const cookieStore = await cookies();
        const userId = cookieStore.get("userId")?.value;

        if (!userId) {
            return { error: "Not authenticated" };
        }

        const now = new Date();
        // Look 24 hours ahead
        const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000);
        // Look 48 hours back to keep some overdue items
        const yesterday = new Date(now.getTime() - 48 * 60 * 60 * 1000);

        const urgentTasks = await db
            .select({
                id: tasks.id,
                title: tasks.title,
                course_name: tasks.course_name,
                deadline: tasks.deadline,
            })
            .from(tasks)
            .where(
                and(
                    eq(tasks.user_id, userId),
                    lte(tasks.deadline, tomorrow),
                    gte(tasks.deadline, yesterday)
                )
            )
            .orderBy(asc(tasks.deadline));

        return {
            tasks: urgentTasks.map(t => ({
                ...t,
                deadline: t.deadline.toISOString()
            }))
        };
    } catch (error) {
        console.error("Failed to fetch deadlines", error);
        return { error: "Failed to fetch deadlines" };
    }
}
