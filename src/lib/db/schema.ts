import { pgTable, serial, text, timestamp, integer, real, json, boolean } from "drizzle-orm/pg-core"
import { relations } from "drizzle-orm"

// Users table
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
})

// Blood tests table
export const bloodTests = pgTable("blood_tests", {
  id: serial("id").primaryKey(),
  userId: integer("user_id")
    .notNull()
    .references(() => users.id),
  name: text("name").notNull(),
  date: timestamp("date").notNull(),
  status: text("status").notNull().default("processed"),
  patientInfo: json("patient_info"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
})

// Health markers table
export const healthMarkers = pgTable("health_markers", {
  id: serial("id").primaryKey(),
  markerId: text("marker_id").notNull(),
  bloodTestId: integer("blood_test_id")
    .notNull()
    .references(() => bloodTests.id),
  name: text("name").notNull(),
  value: real("value").notNull(),
  unit: text("unit").notNull(),
  category: text("category").notNull(),
  rangeMin: real("range_min").notNull(),
  rangeMax: real("range_max").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
})

// Health marker history table
export const healthMarkerHistory = pgTable("health_marker_history", {
  id: serial("id").primaryKey(),
  markerId: text("marker_id").notNull(),
  userId: integer("user_id")
    .notNull()
    .references(() => users.id),
  date: timestamp("date").notNull(),
  value: real("value").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
})

// Recommendations table
export const recommendations = pgTable("recommendations", {
  id: serial("id").primaryKey(),
  userId: integer("user_id")
    .notNull()
    .references(() => users.id),
  title: text("title").notNull(),
  description: text("description").notNull(),
  priority: text("priority").notNull().default("medium"),
  completed: boolean("completed").notNull().default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
})

// Define relations
export const usersRelations = relations(users, ({ many }) => ({
  bloodTests: many(bloodTests),
  healthMarkerHistory: many(healthMarkerHistory),
  recommendations: many(recommendations),
}))

export const bloodTestsRelations = relations(bloodTests, ({ one, many }) => ({
  user: one(users, {
    fields: [bloodTests.userId],
    references: [users.id],
  }),
  healthMarkers: many(healthMarkers),
}))

export const healthMarkersRelations = relations(healthMarkers, ({ one }) => ({
  bloodTest: one(bloodTests, {
    fields: [healthMarkers.bloodTestId],
    references: [bloodTests.id],
  }),
}))

