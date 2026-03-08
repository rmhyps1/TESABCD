"use client";

import { useState, useEffect } from "react";
import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { formatDistanceToNow, isPast } from "date-fns";
import { getDeadlinesAction } from "@/app/actions/notifications";

type NotificationTask = {
    id: string;
    title: string;
    course_name: string;
    deadline: string;
};

export function NotificationDropdown() {
    const [tasks, setTasks] = useState<NotificationTask[]>([]);
    const [loading, setLoading] = useState(true);
    const [isOpen, setIsOpen] = useState(false);
    const [notifiedTaskIds, setNotifiedTaskIds] = useState<Set<string>>(new Set());

    const fetchNotifications = async () => {
        setLoading(true);
        try {
            const data = await getDeadlinesAction();
            if (data?.tasks) {
                setTasks(data.tasks);

                // Auto-open logic: check if any task is within 60 mins and not yet notified
                const now = new Date();
                const threshold = new Date(now.getTime() + 60 * 60 * 1000); // 60 mins from now

                let shouldOpen = false;
                const newNotifiedIds = new Set(notifiedTaskIds);

                data.tasks.forEach((task: NotificationTask) => {
                    const deadline = new Date(task.deadline);
                    // if it's due within the next 60 minutes, and we haven't popped it open yet
                    if (deadline <= threshold && deadline >= now && !notifiedTaskIds.has(task.id)) {
                        shouldOpen = true;
                        newNotifiedIds.add(task.id);
                    }
                });

                if (shouldOpen) {
                    setIsOpen(true);
                    setNotifiedTaskIds(newNotifiedIds);
                }
            }
        } catch (error) {
            console.error("Failed to fetch notifications");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchNotifications();
        // poll every minute
        const interval = setInterval(fetchNotifications, 60000);
        return () => clearInterval(interval);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [notifiedTaskIds]);

    const hasNew = tasks.length > 0;

    return (
        <DropdownMenu open={isOpen} onOpenChange={(open) => {
            setIsOpen(open);
            if (open) fetchNotifications();
        }}>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="relative h-9 w-9 rounded-full">
                    <Bell className="h-5 w-5" />
                    {hasNew && (
                        <span className="absolute top-1.5 right-2 flex h-2.5 w-2.5">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500"></span>
                        </span>
                    )}
                    <span className="sr-only">Toggle notifications</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80">
                <DropdownMenuLabel className="flex justify-between items-center">
                    Notifications
                    <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">{tasks.length}</span>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />

                {loading ? (
                    <div className="p-4 flex justify-center text-sm text-muted-foreground">Loading...</div>
                ) : tasks.length === 0 ? (
                    <div className="p-4 flex flex-col items-center justify-center text-center gap-2 text-muted-foreground">
                        <Bell className="h-8 w-8 opacity-20" />
                        <span className="text-sm">No upcoming deadlines</span>
                        <span className="text-xs">You're all caught up!</span>
                    </div>
                ) : (
                    <div className="max-h-[300px] overflow-y-auto">
                        {tasks.map(task => {
                            const deadlineDate = new Date(task.deadline);
                            const overdue = isPast(deadlineDate);

                            return (
                                <DropdownMenuItem key={task.id} className="flex flex-col items-start gap-1 p-3 cursor-default">
                                    <div className="flex justify-between w-full">
                                        <span className="font-semibold text-sm truncate">{task.title}</span>
                                        <span className={`text-xs whitespace-nowrap ml-2 ${overdue ? 'text-destructive font-bold' : 'text-amber-500 font-medium'}`}>
                                            {overdue ? 'Overdue!' : 'Soon'}
                                        </span>
                                    </div>
                                    <span className="text-xs text-muted-foreground">{task.course_name}</span>
                                    <span className="text-[10px] text-muted-foreground mt-1 bg-secondary px-1.5 py-0.5 rounded">
                                        {formatDistanceToNow(deadlineDate, { addSuffix: true })}
                                    </span>
                                </DropdownMenuItem>
                            );
                        })}
                    </div>
                )}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
