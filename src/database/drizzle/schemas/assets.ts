import { sqliteTable, text, integer, real } from "drizzle-orm/sqlite-core";

export const assetsTable = sqliteTable("assets", {
  id: text("id").primaryKey(),
  class: text("class").notNull(),
  exchange: text("exchange").notNull(),
  symbol: text("symbol").notNull(),
  name: text("name").unique().notNull(),
  status: text("status").notNull(),
  tradable: integer("tradable", { mode: "boolean" }).notNull().default(false),
  marginable: integer("marginable", { mode: "boolean" })
    .notNull()
    .default(false),
  maintenanceMarginRequirement: real("maintenance_margin_requirement"),
  marginRequirementLong: text("margin_requirement_long"),
  marginRequirementShort: text("margin_requirement_short"),
  shortable: integer("shortable", { mode: "boolean" }).notNull().default(false),
  easyToBorrow: integer("easy_to_borrow", { mode: "boolean" })
    .notNull()
    .default(false),
  fractionable: integer("fractionable", { mode: "boolean" })
    .notNull()
    .default(false),
  attributes: text("attributes"), // JSON field for additional attributes
  createdAt: text("created_at").notNull().default("datetime('now')"),
  updatedAt: text("updated_at").notNull().default("datetime('now')"),
});

export type InsertAsset = typeof assetsTable.$inferInsert;
export type SelectAsset = typeof assetsTable.$inferSelect;
