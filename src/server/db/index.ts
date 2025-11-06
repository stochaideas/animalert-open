import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

import { env } from "~/env";
import * as schema from "./schema";

type DrizzleClient = ReturnType<typeof drizzle<typeof schema>>;

const globalForDb = globalThis as typeof globalThis & {
  __postgresConnection?: postgres.Sql;
  __drizzleClient?: DrizzleClient;
};

const getConnection = () => {
  if (!env.DATABASE_URL) {
    throw new Error(
      "DATABASE_URL environment variable is not configured. Set it before using the database.",
    );
  }

  if (!globalForDb.__postgresConnection) {
    globalForDb.__postgresConnection = postgres(env.DATABASE_URL);
  }

  return globalForDb.__postgresConnection;
};

const getClient = () => {
  if (!globalForDb.__drizzleClient) {
    const connection = getConnection();
    globalForDb.__drizzleClient = drizzle(connection, { schema });
  }

  return globalForDb.__drizzleClient;
};

export const db = new Proxy({} as DrizzleClient, {
  get(_target, prop) {
    const client = getClient();
    const value = client[prop as keyof DrizzleClient];

    if (typeof value === "function") {
      return value.bind(client);
    }

    return value;
  },
}) as DrizzleClient;
