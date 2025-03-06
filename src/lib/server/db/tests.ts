import { relations } from "drizzle-orm"
import { pgTable, text, timestamp, uuid, varchar } from "drizzle-orm/pg-core"
import { createSelectSchema } from "drizzle-zod"

// Table for test records (lab reports)
export const testRecords = pgTable("test_record", {
  id: uuid("id").primaryKey().defaultRandom(),
  date: timestamp("date").notNull(),
  notes: text("notes").default(""),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
  userId: uuid("user_id").notNull(),
})

export const testRecordSelectSchema = createSelectSchema(testRecords)

// Table for individual test results within a record
export const testResults = pgTable("test_result", {
  id: uuid("id").primaryKey().defaultRandom(),
  recordId: uuid("record_id")
    .notNull()
    .references(() => testRecords.id, { onDelete: "cascade" }),
  testName: varchar("test_name", { length: 255 }).notNull(),
  value: varchar("value", { length: 100 }).notNull(),
  unit: varchar("unit", { length: 50 }),
  category: varchar("category", { length: 100 }).notNull(),
  referenceMin: varchar("reference_min", { length: 100 }),
  referenceMax: varchar("reference_max", { length: 100 }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
})

export const testResultSelectSchema = createSelectSchema(testResults)

// Define relations using Drizzle's relations helper
export const testRecordsRelations = relations(testRecords, ({ many }) => ({
  results: many(testResults),
}))

export const testResultsRelations = relations(testResults, ({ one }) => ({
  record: one(testRecords, {
    fields: [testResults.recordId],
    references: [testRecords.id],
  }),
}))
