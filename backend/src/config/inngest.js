import { Inngest } from "inngest";
import { connectDB } from "./db.js";
import { User } from "../models/user.model.js";

// Create a client to send and receive events
export const inngest = new Inngest({ id: "slack" });

const syncUser = inngest.createFunction(
    { id: "sync-user" },
    { event: "user.created" },
    async ({ event, step }) => {
        try {
            console.log("Starting user sync for event:", JSON.stringify(event.data, null, 2));

            await connectDB();
            console.log("Database connected successfully");

            const { id, email_addresses, first_name, last_name, image_url } = event.data;

            // Validate required fields
            if (!id) {
                throw new Error("Missing user ID");
            }
            if (!email_addresses || !email_addresses[0]?.email_address) {
                throw new Error("Missing email address");
            }

            const newUser = {
                clerkId: id,
                email: email_addresses[0].email_address,
                name: `${first_name || ""} ${last_name || ""}`.trim() || "Unknown User",
                image: image_url || null
            };

            console.log("Creating user with data:", JSON.stringify(newUser, null, 2));

            // Check if user already exists
            const existingUser = await User.findOne({ clerkId: id });
            if (existingUser) {
                console.log("User already exists:", existingUser.clerkId);
                return { success: true, userId: existingUser.clerkId, message: "User already exists" };
            }

            const createdUser = await User.create(newUser);
            console.log("User synced successfully:", createdUser.clerkId);

            return { success: true, userId: createdUser.clerkId };
        } catch (error) {
            console.error("Detailed error syncing user:", {
                message: error.message,
                stack: error.stack,
                eventData: event.data
            });
            throw error;
        }
    }
);

const deleteUserFromDB = inngest.createFunction(
    { id: "delete-user-from-db" },
    { event: "user.deleted" },
    async ({ event, step }) => {
        try {
            await connectDB();

            const { id } = event.data;

            if (!id) {
                throw new Error("Missing user ID for deletion");
            }

            const result = await User.deleteOne({ clerkId: id });
            console.log("User deleted:", id, "Deleted count:", result.deletedCount);

            return { success: true, deletedCount: result.deletedCount };
        } catch (error) {
            console.error("Error deleting user:", error);
            throw error;
        }
    }
);

// Test function to verify Inngest is working
const testFunction = inngest.createFunction(
    { id: "test-function" },
    { event: "test/ping" },
    async ({ event }) => {
        console.log("Test function triggered with:", event.data);
        return { success: true, message: "Test function works!", timestamp: new Date().toISOString() };
    }
);

// Create an empty array where we'll export future Inngest functions
export const functions = [syncUser, deleteUserFromDB, testFunction];