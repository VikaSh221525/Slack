import { serve } from "inngest/express";
import { functions, inngest } from "../src/config/inngest.js";

// Create the Inngest handler for Vercel
const handler = serve({ 
    client: inngest, 
    functions
});

// Export for Vercel serverless functions
export default async function(req, res) {
    return handler(req, res);
}