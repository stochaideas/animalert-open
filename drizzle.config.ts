import { type Config } from "drizzle-kit";

import { env } from "~/env";

const databaseUrl =
  env.DATABASE_URL ??
  // Provide a placeholder URL so drizzle-kit configuration stays type-safe
  // even when DATABASE_URL is intentionally omitted during build steps.
  "postgres://placeholder:placeholder@localhost:5432/placeholder";

if (!env.DATABASE_URL && process.env.NODE_ENV !== "production") {
  console.warn(
    "[drizzle.config] DATABASE_URL is not set; using a placeholder connection string.",
  );
}

export default {
  schema: "./src/server/db/schema.ts",
  dialect: "postgresql",
  dbCredentials: {
    url: databaseUrl,
  },
  tablesFilter: ["*"],
  casing: "snake_case",
} satisfies Config;
