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
import { createTask } from "@/app/actions/task";

export function TaskDialog() {
    const [open, setOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);

        const formData = new FormData(e.currentTarget);
        const result = await createTask(formData);

        if (result?.error) {
            toast.error(result.error);
        } else {
            toast.success("Task created successfully!");
            setOpen(false);
        }
        setIsLoading(false);
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button>Add Task</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Add New Task</DialogTitle>
                    <DialogDescription>
                        Create a new task with a specific deadline.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit}>
                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="title">Task Title</Label>
                            <Input id="title" name="title" placeholder="Submit assignment 1" required disabled={isLoading} />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="courseName">Course Name</Label>
                            <Input id="courseName" name="courseName" placeholder="Software Engineering" required disabled={isLoading} />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="description">Description (Optional)</Label>
                            <Input id="description" name="description" placeholder="Details..." disabled={isLoading} />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="deadline">Deadline</Label>
                            <Input id="deadline" name="deadline" type="datetime-local" required disabled={isLoading} />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button type="submit" disabled={isLoading}>
                            {isLoading ? "Saving..." : "Save Task"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
