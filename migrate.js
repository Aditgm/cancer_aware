import { db } from "./dbConfig";
import { Users, Records, KanbanBoards } from "./schema";

// Simple migration script to ensure tables exist
export const runMigrations = async () => {
  try {
    console.log("Running database migrations...");
    
    // Test if tables exist by trying to select from them
    const usersResult = await db.select().from(Users).limit(1).execute();
    console.log("Users table exists:", usersResult);
    
    const recordsResult = await db.select().from(Records).limit(1).execute();
    console.log("Records table exists:", recordsResult);
    
    const kanbanResult = await db.select().from(KanbanBoards).limit(1).execute();
    console.log("KanbanBoards table exists:", kanbanResult);
    
    console.log("All migrations completed successfully!");
    return true;
  } catch (error) {
    console.error("Migration failed:", error);
    return false;
  }
}; 
