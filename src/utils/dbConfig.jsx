import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";

const sql = neon(
  import.meta.env.VITE_DATABASE_URL || 
  "postgresql://finan-smart_owner:uk3aed9Q0Zotj@ep-wispy-breeze-a5iadk8t.us-east-2.aws.neon.tech/cancer-aware?sslmode=require"
);

export const db = drizzle(sql, { schema });

// Test database connection
export const testConnection = async () => {
  try {
    console.log("Testing database connection...");
    const result = await sql`SELECT 1 as test`;
    console.log("Database connection successful:", result);
    return true;
  } catch (error) {
    console.error("Database connection failed:", error);
    return false;
  }
};
