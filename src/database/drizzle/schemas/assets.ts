import { sql } from "drizzle-orm";
import { integer, real, sqliteTable, text } from "drizzle-orm/sqlite-core";

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

  // Attribute flags
  ptpNoException: integer("ptp_no_exception", { mode: "boolean" }).default(
    false,
  ),
  ptpWithException: integer("ptp_with_exception", { mode: "boolean" }).default(
    false,
  ),
  ipo: integer("ipo", { mode: "boolean" }).default(false),
  hasOptions: integer("has_options", { mode: "boolean" }).default(false),
  optionsLateClose: integer("options_late_close", { mode: "boolean" }).default(
    false,
  ),

  // Timestamps
  createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text("updated_at").notNull().default(sql`CURRENT_TIMESTAMP`),
  deletedAt: text("deleted_at"), // Soft delete field
});

export type InsertAsset = typeof assetsTable.$inferInsert;
export type SelectAsset = typeof assetsTable.$inferSelect;
