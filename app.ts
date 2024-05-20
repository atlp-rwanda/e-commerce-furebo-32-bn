import express, { Request, Response } from "express";
import userRoutes from "./src/routes/user.route";

const app = express();

app.use(express.json());

app.get('/', (_req: Request, res: Response) => {
    return res.json({ message: "welcome to ATLP Backend APIs" });
});
app.use('/api/users', userRoutes);

export default app;
