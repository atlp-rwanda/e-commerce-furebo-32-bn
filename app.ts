import express, { Request, Response } from "express";

const app = express();

app.use(express.json());

// Route handler with underscore to indicate unused parameter
app.get('/', (_req: Request, res: Response) => {
    return res.json({ message: "welcome to ATLP Backend APIs" });
});

export default app;
