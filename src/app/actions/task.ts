"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { db } from "@/lib/db";
import { tasks } from "@/lib/schema";
import { generateId } from "@/lib/auth";

export async function createTask(formData: FormData) {
    try {
        const cookieStore = await cookies();
        const userId = cookieStore.get("userId")?.value;

        if (!userId) {
            return { error: "Not authenticated" };
        }

        const title = formData.get("title") as string;
        const courseName = formData.get("courseName") as string;
        const description = formData.get("description") as string | null;
        const deadlineStr = formData.get("deadline") as string;

        if (!title || !courseName || !deadlineStr) {
            return { error: "Missing required fields" };
        }

        // Attempt to get time from worldtimeapi as simple NTP alternative
        let dateAdded = new Date();
        try {
            const timeRes = await fetch("http://worldtimeapi.org/api/ip", { cache: "no-store", next: { revalidate: 0 } });
            if (timeRes.ok) {
                const timeData = await timeRes.json();
                dateAdded = new Date(timeData.datetime);
            }
        } catch (e) {
            console.warn("NTP sync failed, falling back to local time");
        }

        const deadline = new Date(deadlineStr);

        await db.insert(tasks).values({
            id: generateId(),
            user_id: userId,
            title,
            description: description || null,
            course_name: courseName,
            date_added: dateAdded,
            deadline,
            is_notified: false,
        });

        revalidatePath("/dashboard");
        return { success: true };
    } catch (error) {
        console.error("Failed to create task", error);
        return { error: "Failed to create task" };
    }
}

export async function updateTask(formData: FormData) {
    try {
        const cookieStore = await cookies();
        const userId = cookieStore.get("userId")?.value;

        if (!userId) {
            return { error: "Not authenticated" };
        }

        const id = formData.get("id") as string;
        const title = formData.get("title") as string;
        const courseName = formData.get("courseName") as string;
        const description = formData.get("description") as string | null;
        const deadlineStr = formData.get("deadline") as string;

        if (!id || !title || !courseName || !deadlineStr) {
            return { error: "Missing required fields" };
        }

        const deadline = new Date(deadlineStr);

        // Update task and ensure it belongs to the user
        const { eq, and } = await import("drizzle-orm");

        await db.update(tasks).set({
            title,
            description: description || null,
            course_name: courseName,
            deadline,
        }).where(
            and(
                eq(tasks.id, id),
                eq(tasks.user_id, userId)
            )
        );

        revalidatePath("/dashboard");
        return { success: true };
    } catch (error) {
        console.error("Failed to update task", error);
        return { error: "Failed to update task" };
    }
}

export async function deleteTask(id: string) {
    try {
        const cookieStore = await cookies();
        const userId = cookieStore.get("userId")?.value;

        if (!userId) {
            return { error: "Not authenticated" };
        }

        const { eq, and } = await import("drizzle-orm");

        await db.delete(tasks).where(
            and(
                eq(tasks.id, id),
                eq(tasks.user_id, userId)
            )
        );

        revalidatePath("/dashboard");
        return { success: true };
    } catch (error) {
        console.error("Failed to delete task", error);
        return { error: "Failed to delete task" };
    }
}
