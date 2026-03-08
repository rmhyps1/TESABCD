import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="flex items-center justify-between px-6 py-4 border-b">
        <div className="text-xl font-bold flex items-center gap-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="w-6 h-6"
          >
            <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
            <polyline points="14 2 14 8 20 8" />
            <path d="m9 15 2 2 4-4" />
          </svg>
          TaskSync
        </div>
        <div className="flex gap-4">
          <Link href="/login">
            <Button variant="ghost">Login</Button>
          </Link>
          <Link href="/register">
            <Button>Register</Button>
          </Link>
        </div>
      </header>
      <main className="flex-1 flex flex-col items-center justify-center p-6 text-center">
        <h1 className="text-5xl font-extrabold tracking-tight mb-6">
          Master Your Deadlines
        </h1>
        <p className="text-xl text-muted-foreground mb-8 max-w-2xl">
          A powerful task management system designed for students and lecturers. Keep track of your assignments with precise NTP-synced timing and interactive calendar views.
        </p>
        <div className="flex gap-4">
          <Link href="/register">
            <Button size="lg" className="px-8">Get Started</Button>
          </Link>
          <Link href="/login">
            <Button variant="outline" size="lg" className="px-8">Sign In</Button>
          </Link>
        </div>
      </main>
      <footer className="py-6 text-center text-sm text-muted-foreground border-t">
        &copy; {new Date().getFullYear()} TaskSync. All rights reserved.
      </footer>
    </div>
  );
}
