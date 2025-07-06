import React, { createContext, useContext, useState, useCallback } from "react";
import { db } from "../utils/dbConfig"; // Adjust the path to your dbConfig
import { Users, Records, KanbanBoards } from "../utils/schema"; // Adjust the path to your schema definitions
import { eq } from "drizzle-orm";

// Create a context
const StateContext = createContext();

// Provider component
export const StateContextProvider = ({ children }) => {
  const [users, setUsers] = useState([]);
  const [records, setRecords] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [kanbanBoard, setKanbanBoard] = useState(null);

  // Function to fetch all users
  const fetchUsers = useCallback(async () => {
    try {
      console.log("Fetching users...");
      const result = await db.select().from(Users).execute();
      console.log("Users fetched:", result);
      setUsers(result);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  }, []);

  // Function to fetch user details by email
  const fetchUserByEmail = useCallback(async (email) => {
    try {
      console.log("Fetching user by email:", email);
      const result = await db
        .select()
        .from(Users)
        .where(eq(Users.createdBy, email))
        .execute();
      console.log("User fetched:", result);
      if (result.length > 0) {
        setCurrentUser(result[0]);
      } else {
        console.log("No user found for email:", email);
        setCurrentUser(null);
      }
    } catch (error) {
      console.error("Error fetching user by email:", error);
      setCurrentUser(null);
    }
  }, []);

  // Function to create a new user
  const createUser = useCallback(async (userData) => {
    try {
      console.log("Creating user:", userData);
      const newUser = await db
        .insert(Users)
        .values(userData)
        .returning({ id: Users.id, createdBy: Users.createdBy })
        .execute();
      console.log("User created:", newUser);
      setUsers((prevUsers) => [...prevUsers, newUser[0]]);
      return newUser[0];
    } catch (error) {
      console.error("Error creating user:", error);
      return null;
    }
  }, []);

  // Function to fetch all records for a specific user
  const fetchUserRecords = useCallback(async (userEmail) => {
    try {
      console.log("Fetching records for user:", userEmail);
      const result = await db
        .select()
        .from(Records)
        .where(eq(Records.createdBy, userEmail))
        .execute();
      console.log("Records fetched:", result);
      setRecords(result);
    } catch (error) {
      console.error("Error fetching user records:", error);
      setRecords([]);
    }
  }, []);

  // Function to create a new record
  const createRecord = useCallback(async (recordData) => {
    try {
      console.log("Creating record:", recordData);
      const newRecord = await db
        .insert(Records)
        .values(recordData)
        .returning({ id: Records.id })
        .execute();
      console.log("Record created:", newRecord);
      setRecords((prevRecords) => [...prevRecords, newRecord[0]]);
      return newRecord[0];
    } catch (error) {
      console.error("Error creating record:", error);
      return null;
    }
  }, []);

  const updateRecord = useCallback(async (recordData) => {
    try {
      const { documentID, ...dataToUpdate } = recordData;
      console.log("Updating record:", documentID, dataToUpdate);
      const updatedRecords = await db
        .update(Records)
        .set(dataToUpdate)
        .where(eq(Records.id, documentID))
        .returning();
      console.log("Record updated:", updatedRecords);
      return updatedRecords;
    } catch (error) {
      console.error("Error updating record:", error);
      return null;
    }
  }, []);

  const deleteRecord = useCallback(async (recordId) => {
    try {
      console.log("Deleting record:", recordId);
      const deletedRecords = await db
        .delete(Records)
        .where(eq(Records.id, recordId))
        .returning();
      console.log("Record deleted:", deletedRecords);
      
      // Update local state
      setRecords((prevRecords) => prevRecords.filter(record => record.id !== recordId));
      
      return deletedRecords;
    } catch (error) {
      console.error("Error deleting record:", error);
      return null;
    }
  }, []);

  // Function to update user details
  const updateUser = useCallback(async (userId, updatedData) => {
    try {
      const updatedUser = await db
        .update(Users)
        .set(updatedData)
        .where(eq(Users.id, userId))
        .returning()
        .execute();
      if (updatedUser.length > 0) {
        setCurrentUser(updatedUser[0]);
      }
      return updatedUser[0];
    } catch (error) {
      console.error("Error updating user:", error);
      return null;
    }
  }, []);

  // Function to fetch Kanban board for a user
  const fetchKanbanBoard = useCallback(async (userId) => {
    try {
      const result = await db
        .select()
        .from(KanbanBoards)
        .where(eq(KanbanBoards.userId, userId))
        .execute();
      if (result.length > 0) {
        setKanbanBoard(result[0].boardData);
      } else {
        setKanbanBoard(null);
      }
    } catch (error) {
      console.error("Error fetching Kanban board:", error);
      setKanbanBoard(null);
    }
  }, []);

  // Function to create a new Kanban board for a user
  const createKanbanBoard = useCallback(async (userId, boardData) => {
    try {
      const newBoard = await db
        .insert(KanbanBoards)
        .values({ userId, boardData })
        .returning()
        .execute();
      setKanbanBoard(newBoard[0].boardData);
      return newBoard[0];
    } catch (error) {
      console.error("Error creating Kanban board:", error);
      return null;
    }
  }, []);

  // Function to update Kanban board for a user
  const updateKanbanBoard = useCallback(async (userId, boardData) => {
    try {
      const updated = await db
        .update(KanbanBoards)
        .set({ boardData })
        .where(eq(KanbanBoards.userId, userId))
        .returning()
        .execute();
      setKanbanBoard(boardData);
      return updated[0];
    } catch (error) {
      console.error("Error updating Kanban board:", error);
      return null;
    }
  }, []);

  return (
    <StateContext.Provider
      value={{
        users,
        records,
        fetchUsers,
        fetchUserByEmail,
        createUser,
        fetchUserRecords,
        createRecord,
        currentUser,
        updateRecord,
        deleteRecord,
        updateUser,
        kanbanBoard,
        fetchKanbanBoard,
        createKanbanBoard,
        updateKanbanBoard,
      }}
    >
      {children}
    </StateContext.Provider>
  );
};

// Custom hook to use the context
export const useStateContext = () => useContext(StateContext);
