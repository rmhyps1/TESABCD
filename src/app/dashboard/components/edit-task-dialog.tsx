"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { updateTask } from "@/app/actions/task";
import { format } from "date-fns";
import { Pencil } from "lucide-react";

type Task = {
    id: string;
    title: string;
    description: string | null;
    course_name: string;
    deadline: string;
    is_notified: boolean | null;
};

export function EditTaskDialog({ task }: { task: Task }) {
    const [open, setOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    // Ensure the date is in the correct format for the datetime-local input
    // The format needs to be YYYY-MM-DDThh:mm
    const formattedDeadline = format(new Date(task.deadline), "yyyy-MM-dd'T'HH:mm");

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);

        const formData = new FormData(e.currentTarget);
        formData.append("id", task.id); // implicitly send the task ID

        const result = await updateTask(formData);

        if (result?.error) {
            toast.error(result.error);
        } else {
            toast.success("Task updated successfully!");
            setOpen(false);
        }
        setIsLoading(false);
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-primary">
                    <Pencil className="h-4 w-4" />
                    <span className="sr-only">Edit Task</span>
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Edit Task</DialogTitle>
                    <DialogDescription>
                        Modify task details and save changes.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit}>
                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="title">Task Title</Label>
                            <Input id="title" name="title" defaultValue={task.title} required disabled={isLoading} />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="courseName">Course Name</Label>
                            <Input id="courseName" name="courseName" defaultValue={task.course_name} required disabled={isLoading} />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="description">Description (Optional)</Label>
                            <Input id="description" name="description" defaultValue={task.description || ""} disabled={isLoading} />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="deadline">Deadline</Label>
                            <Input id="deadline" name="deadline" type="datetime-local" defaultValue={formattedDeadline} required disabled={isLoading} />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button type="submit" disabled={isLoading}>
                            {isLoading ? "Saving..." : "Save Changes"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
