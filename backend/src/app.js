import express from "express";
import { clerkMiddleware } from '@clerk/express';

const app = express();
app.use(express.json());
app.use(clerkMiddleware()); //req.auth will be available in the request object

app.get("/", (req, res) => {
    res.send("Hello World!");
});


export default app;