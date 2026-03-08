import { drizzle } from "drizzle-orm/better-sqlite3";
import Database from "better-sqlite3";
import * as schema from "./schema";
import path from "path";

// Create database file in project root
const dbPath = path.join(process.cwd(), "app.db");
const sqlite = new Database(dbPath);

// Enable foreign keys
sqlite.pragma("foreign_keys = ON");

function ensureSchema() {
	sqlite.exec(`
		CREATE TABLE IF NOT EXISTS users (
			id TEXT PRIMARY KEY,
			email TEXT NOT NULL UNIQUE,
			password_hash TEXT NOT NULL,
			name TEXT,
			created_at INTEGER NOT NULL
		);

		CREATE TABLE IF NOT EXISTS tasks (
			id TEXT PRIMARY KEY,
			user_id TEXT NOT NULL,
			title TEXT NOT NULL,
			description TEXT,
			course_name TEXT NOT NULL,
			date_added INTEGER NOT NULL,
			deadline INTEGER NOT NULL,
			is_notified INTEGER DEFAULT 0,
			FOREIGN KEY (user_id) REFERENCES users(id)
		);
	`);
}

ensureSchema();

export const db = drizzle(sqlite, { schema });
