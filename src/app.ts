import express, { Request, Response } from "express";
import userRoutes from "./routes/user.route";
import swaggerUi from 'swagger-ui-express';
import specs from '../swagger.config';
import morgan from "morgan";
import bodyParser from 'body-parser';

const app = express();

app.use(bodyParser.json());
app.use(express.json());
app.use(morgan("dev"))

app.get('/', (_req: Request, res: Response) => {
    return res.json({ message: "welcome to ATLP Backend APIs" });
});

app.use('/api/users', userRoutes);

// Swagger UI route
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

export default app;
