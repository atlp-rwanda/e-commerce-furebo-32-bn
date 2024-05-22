import express, { Request, Response } from "express";
import userRoutes from "./src/routes/user.route";
import swaggerUi from 'swagger-ui-express';
import specs from './swagger.config';

const app = express();

app.use(express.json());

app.get('/', (_req: Request, res: Response) => {
    return res.json({ message: "welcome to ATLP Backend APIs" });
});
app.use('/api/users', userRoutes);
// Swagger UI route
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

export default app;
