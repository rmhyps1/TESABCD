import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";
import { relations } from "drizzle-orm";

export const users = sqliteTable("users", {
  id: text("id").primaryKey(),
  email: text("email").unique().notNull(),
  password_hash: text("password_hash").notNull(),
  name: text("name"),
  created_at: integer("created_at", { mode: "timestamp" }).notNull(),
});

export const tasks = sqliteTable("tasks", {
  id: text("id").primaryKey(),
  user_id: text("user_id").notNull(),
  title: text("title").notNull(),
  description: text("description"),
  course_name: text("course_name").notNull(),
  date_added: integer("date_added", { mode: "timestamp" }).notNull(),
  deadline: integer("deadline", { mode: "timestamp" }).notNull(),
  is_notified: integer("is_notified", { mode: "boolean" }).default(false),
});

export const usersRelations = relations(users, ({ many }) => ({
  tasks: many(tasks),
}));

export const tasksRelations = relations(tasks, ({ one }) => ({
  user: one(users, {
    fields: [tasks.user_id],
    references: [users.id],
  }),
}));
