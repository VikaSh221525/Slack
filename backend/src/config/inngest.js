import { Inngest } from "inngest";
import { connectDB } from "./db.js";
import { User } from "../models/user.model.js";

// Create a client to send and receive events
export const inngest = new Inngest({ id: "slack" });

const syncUser = inngest.createFunction(
    { id: "sync-user" },
    { event: "clerk/user.created" },
    async ({ event, step }) => {
        try {
            await connectDB();

            const { id, email_addresses, first_name, last_name, image_url } = event.data;

            // Validate required fields
            if (!id || !email_addresses || !email_addresses[0]?.email_address) {
                throw new Error("Missing required user data");
            }

            const newUser = {
                clerkId: id,
                email: email_addresses[0].email_address,
                name: `${first_name || ""} ${last_name || ""}`.trim(),
                image: image_url || null
            };

            const createdUser = await User.create(newUser);
            console.log("User synced successfully:", createdUser.clerkId);

            return { success: true, userId: createdUser.clerkId };
        } catch (error) {
            console.error("Error syncing user:", error);
            throw error; // Re-throw to let Inngest handle retries
        }
    }
);

const deleteUserFromDB = inngest.createFunction(
    { id: "delete-user-from-db" },
    { event: "clerk/user.deleted" },
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

// Create an empty array where we'll export future Inngest functions
export const functions = [syncUser, deleteUserFromDB];