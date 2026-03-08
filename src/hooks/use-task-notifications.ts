"use client";

import { useEffect, useState } from "react";
import { formatDistanceToNow, isBefore, addMinutes } from "date-fns";

type Task = {
    id: string;
    title: string;
    deadline: string;
    course_name: string;
};

// Check for tasks due within the next hour (60 minutes)
const NOTIFICATION_THRESHOLD_MINUTES = 60;

export function useTaskNotifications(tasks: Task[]) {
    const [permission, setPermission] = useState<NotificationPermission>("default");
    const [notifiedTaskIds, setNotifiedTaskIds] = useState<Set<string>>(new Set());

    useEffect(() => {
        if ("Notification" in window) {
            setPermission(Notification.permission);
        }
    }, []);

    const requestPermission = async () => {
        if (!("Notification" in window)) return;
        const result = await Notification.requestPermission();
        setPermission(result);
        return result;
    };

    useEffect(() => {
        if (permission !== "granted" || tasks.length === 0) return;

        const checkDeadlines = () => {
            const now = new Date();
            const thresholdTime = addMinutes(now, NOTIFICATION_THRESHOLD_MINUTES);

            tasks.forEach((task) => {
                const deadlineDate = new Date(task.deadline);

                // If deadline is in the past, skip
                if (isBefore(deadlineDate, now)) return;

                // If deadline is within the threshold and we haven't notified yet
                if (isBefore(deadlineDate, thresholdTime) && !notifiedTaskIds.has(task.id)) {
                    const timeLeft = formatDistanceToNow(deadlineDate);

                    const notification = new Notification(`Task Deadline Approaching!`, {
                        body: `"${task.title}" for ${task.course_name} is due in ${timeLeft}.`,
                        icon: "/favicon.ico",
                        requireInteraction: true // keeps it on screen until dismissed
                    });

                    // Add to notified group to prevent spamming
                    setNotifiedTaskIds(prev => {
                        const newSet = new Set(prev);
                        newSet.add(task.id);
                        return newSet;
                    });
                }
            });
        };

        // Check immediately
        checkDeadlines();

        // Check every minute
        const intervalId = setInterval(checkDeadlines, 60000);
        return () => clearInterval(intervalId);
    }, [tasks, permission, notifiedTaskIds]);

    return { permission, requestPermission };
}
