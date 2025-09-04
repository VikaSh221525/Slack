import app from "./src/app.js";
import { connectDB } from "./src/config/db.js";
import { ENV } from "./src/config/env.js";
const port = ENV.PORT

connectDB();

const startServer = async () => {
    try {
        if(ENV.NODE_ENV !== 'production'){
            app.listen(port, () => {
                console.log(`Server is running on port ${port}`);
            })
        }
    } catch (error) {
        console.error("Error starting the server: ", error);
        process.exit(1);
    }
}

startServer();

// Export the app for Vercel
export default app;