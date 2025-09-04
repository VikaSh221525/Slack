import mongoose from "mongoose";
import { ENV } from "./env.js";

export const connectDB = async () => {
    try {
        await mongoose.connect(ENV.DB_URL);
        console.log("DB connected successfully!");
    } catch (error) {
        console.log("Error connecting in DB: ", error);
        process.exit(1);  
    }
}