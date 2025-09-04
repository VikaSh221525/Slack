import express from "express";
import { clerkMiddleware } from '@clerk/express';
import { serve } from "inngest/express";
import { functions, inngest } from "./config/inngest";

const app = express();
app.use(express.json());
app.use(clerkMiddleware()); //req.auth will be available in the request object
app.use("/api/inngest", serve({ client: inngest, functions }));


export default app;