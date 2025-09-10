import { serve } from "inngest/express";
import { functions, inngest } from "../src/config/inngest.js";

// Create the handler
const handler = serve({ 
    client: inngest, 
    functions,
    // Add logging for debugging
    logLevel: "debug"
});

export default handler;