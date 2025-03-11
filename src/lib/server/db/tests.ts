import { relations } from "drizzle-orm"
import { pgTable, text, timestamp, uuid, varchar } from "drizzle-orm/pg-core"
import { createSelectSchema } from "drizzle-zod"
import { users } from "./schema"

// Table for documents (lab reports)
export const documents = pgTable("document", {
  id: uuid("id").primaryKey().defaultRandom(),
  date: timestamp("date").notNull(),
  fileName: varchar("file_name").notNull(),
  content: text("content").notNull(),
  title: varchar("title").notNull(),
  notes: text("notes").default(""),
  mistralId: varchar("mistral_id", { length: 255 }).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
  userId: uuid("user_id").notNull(),
})

export const documentSelectSchema = createSelectSchema(documents)

// Table for individual markers within a document
export const markers = pgTable("marker", {
  id: uuid("id").primaryKey().defaultRandom(),
  documentId: uuid("document_id").references(() => documents.id, { onDelete: "cascade" }),
  name: varchar("name", { length: 255 }).notNull(),
  value: varchar("value", { length: 100 }).notNull(),
  unit: varchar("unit", { length: 50 }),
  category: varchar("category", { length: 100 }).notNull(),
  referenceMin: varchar("reference_min", { length: 100 }),
  referenceMax: varchar("reference_max", { length: 100 }),
  userId: uuid("user_id").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
})

export const markerSelectSchema = createSelectSchema(markers)

// Define relations using Drizzle's relations helper
export const documentsRelations = relations(documents, ({ many }) => ({
  markers: many(markers),
}))

export const markersRelations = relations(markers, ({ one }) => ({
  document: one(documents, {
    fields: [markers.documentId],
    references: [documents.id],
  }),
  user: one(users, {
    fields: [markers.userId],
    references: [users.id],
  }),
}))
