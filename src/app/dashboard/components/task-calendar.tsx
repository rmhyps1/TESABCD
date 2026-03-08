"use client";

import { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { format, isSameDay } from "date-fns";
import { EditTaskDialog } from "./edit-task-dialog";
import { Trash2, Bell, BellOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTaskNotifications } from "@/hooks/use-task-notifications";

type Task = {
    id: string;
    title: string;
    description: string | null;
    course_name: string;
    deadline: string;
    is_notified: boolean | null;
};

export function TaskCalendar({ initialTasks = [] }: { initialTasks?: Task[] }) {
    const [date, setDate] = useState<Date | undefined>(new Date());
    const { permission, requestPermission } = useTaskNotifications(initialTasks);

    const tasksForDate = date
        ? initialTasks.filter(t => isSameDay(new Date(t.deadline), date))
        : [];

    const taskDates = initialTasks.map(t => new Date(t.deadline));

    return (
        <div className="flex flex-col md:flex-row gap-8 items-start">
            <div className="flex-shrink-0">
                <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    className="rounded-md border shadow bg-background"
                    modifiers={{ indicator: taskDates }}
                />
            </div>
            <div className="flex-1 w-full space-y-4">
                <div className="flex items-center justify-between border-b pb-2">
                    <h3 className="font-semibold text-xl">
                        {date ? format(date, "EEEE, MMMM d, yyyy") : "Select a Date"}
                    </h3>

                    {permission !== "granted" && (
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={requestPermission}
                            className="text-xs h-8 gap-1.5"
                        >
                            <BellOff className="h-3.5 w-3.5" />
                            Enable Alerts
                        </Button>
                    )}
                    {permission === "granted" && (
                        <div className="flex items-center text-xs text-muted-foreground bg-secondary/50 px-2 py-1 rounded-md gap-1.5 border">
                            <Bell className="h-3.5 w-3.5 text-primary" />
                            Alerts On
                        </div>
                    )}
                </div>

                {tasksForDate.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground border border-dashed rounded-lg">
                        No tasks due on this date.
                    </div>
                ) : (
                    tasksForDate.map(task => (
                        <Card key={task.id}>
                            <CardHeader className="pb-3">
                                <CardTitle className="text-base flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        {task.title}
                                        {isSameDay(new Date(task.deadline), new Date()) && (
                                            <span className="text-xs px-2 py-1 bg-primary/10 text-primary rounded-full hidden sm:inline-block">Due today</span>
                                        )}
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <EditTaskDialog task={task} />
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-8 w-8 text-muted-foreground hover:text-destructive"
                                            onClick={async () => {
                                                if (confirm("Are you sure you want to delete this task?")) {
                                                    const { deleteTask } = await import("@/app/actions/task");
                                                    const { toast } = await import("sonner");
                                                    const result = await deleteTask(task.id);
                                                    if (result?.error) toast.error(result.error);
                                                    else toast.success("Task deleted");
                                                }
                                            }}
                                        >
                                            <Trash2 className="h-4 w-4" />
                                            <span className="sr-only">Delete Task</span>
                                        </Button>
                                    </div>
                                </CardTitle>
                                <CardDescription className="font-medium text-foreground">{task.course_name}</CardDescription>
                            </CardHeader>
                            <CardContent className="text-sm">
                                {task.description && <p className="text-muted-foreground">{task.description}</p>}
                                <p className="mt-4 text-xs font-medium text-destructive">Deadline: {format(new Date(task.deadline), "HH:mm")}</p>
                            </CardContent>
                        </Card>
                    ))
                )}
            </div>
        </div>
    );
}
