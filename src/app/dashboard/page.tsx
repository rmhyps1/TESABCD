import { TaskCalendar } from "./components/task-calendar";
import { TaskDialog } from "./components/task-dialog";
import { cookies } from "next/headers";
import { db } from "@/lib/db";
import { tasks } from "@/lib/schema";
import { eq, asc } from "drizzle-orm";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
    const cookieStore = await cookies();
    const userId = cookieStore.get("userId")?.value;

    if (!userId) {
        redirect("/login");
    }

    // Fetch tasks for this user
    const userTasks = await db
        .select()
        .from(tasks)
        .where(eq(tasks.user_id, userId))
        .orderBy(asc(tasks.deadline));

    // Convert dates so they can be passed to client component
    const serializedTasks = userTasks.map(task => ({
        ...task,
        date_added: task.date_added.toISOString(),
        deadline: task.deadline.toISOString()
    }));

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Calendar</h2>
                    <p className="text-muted-foreground">
                        Manage your tasks and deadlines.
                    </p>
                </div>
                <TaskDialog />
            </div>
            <div className="border rounded-lg p-6 bg-card min-h-[500px]">
                <TaskCalendar initialTasks={serializedTasks} />
            </div>
        </div>
    );
}
