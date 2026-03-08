"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/mode-toggle";
import { useRouter } from "next/navigation";
import { Menu } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

import { NotificationDropdown } from "./notification-dropdown";

export function Navbar({ userName }: { userName: string }) {
    const router = useRouter();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const handleLogout = async () => {
        await fetch("/api/auth/logout", { method: "POST" });
        router.push("/login");
        router.refresh();
    };

    return (
        <header className="sticky top-0 z-50 flex items-center justify-between px-4 sm:px-6 py-4 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            {/* Logo and App Name */}
            <Link href="/dashboard" className="flex items-center gap-2 group">
                <div className="bg-primary/10 p-2 rounded-xl group-hover:bg-primary/20 transition-colors">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="w-6 h-6 text-primary"
                    >
                        <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
                        <polyline points="14 2 14 8 20 8" />
                        <path d="m9 15 2 2 4-4" />
                    </svg>
                </div>
                <div className="flex flex-col">
                    <span className="text-xl font-bold leading-tight tracking-tight">TaskSync</span>
                    <span className="text-xs font-medium text-muted-foreground hidden sm:block">Hello, {userName}</span>
                </div>
            </Link>

            {/* Right Side Actions */}
            <div className="flex items-center gap-2 sm:gap-4">
                <NotificationDropdown />
                <ModeToggle />

                {/* Desktop User Info */}
                <div className="hidden sm:flex items-center gap-4">
                    <div className="w-9 h-9 rounded-full bg-primary/20 flex items-center justify-center text-sm font-bold text-primary mr-2 cursor-default select-none shadow-sm border border-primary/30">
                        {userName.charAt(0).toUpperCase()}
                    </div>
                    <Button variant="outline" size="sm" onClick={handleLogout}>
                        Logout
                    </Button>
                </div>

                {/* Mobile Menu Toggle */}
                <Button variant="ghost" size="icon" className="sm:hidden" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
                    <Menu className="h-6 w-6" />
                </Button>
            </div>

            {/* Mobile Navigation Menu Dropdown */}
            {isMobileMenuOpen && (
                <div className="absolute top-[100%] left-0 w-full bg-background border-b shadow-lg p-4 flex flex-col gap-4 sm:hidden animate-in slide-in-from-top-2">
                    <div className="flex items-center gap-3 border-b pb-4">
                        <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-base font-bold text-primary shadow-sm border border-primary/30">
                            {userName.charAt(0).toUpperCase()}
                        </div>
                        <span className="text-sm font-medium">Hello, {userName}</span>
                    </div>
                    <Button variant="destructive" className="w-full" onClick={handleLogout}>
                        Logout
                    </Button>
                </div>
            )}
        </header>
    );
}
