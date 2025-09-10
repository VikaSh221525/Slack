import { serve } from "inngest/express";
import { functions, inngest } from "../src/config/inngest.js";

// Create the handler outside the function
const inngestHandler = serve({
    client: inngest,
    functions
});

export default inngestHandler;