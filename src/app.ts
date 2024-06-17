import express, { Request, Response } from "express";
import userRoutes from "./routes/user.route";
import swaggerUi from 'swagger-ui-express';
import specs from '../swagger.config';
import morgan from "morgan";
import bodyParser from 'body-parser';
import productRoutes from "./routes/product.route"
import cartRoutes from "./routes/cart.route";
import collectionRoute from "./routes/collection.route"
import wishlistRoute from "./routes/wishlist.route"
import session from "express-session";
import passport from "passport";
import LoginByGoogleRoute from "../src/routes/Login-by-google.route";
import dotenv from 'dotenv'

const app = express();

dotenv.config()


app.use(session({secret:process.env.GOOGLE_SECRET2 as string}));
app.use(passport.initialize());
app.use(passport.session())

app.use(bodyParser.json());
app.use(express.json());
app.use(morgan("dev"))

app.use ('/api',productRoutes)
app.use('/api',collectionRoute)

app.get('/', (_req: Request, res: Response) => {
    return res.json({ message: "welcome to ATLP Backend APIs" });
});

app.use('/api/users', userRoutes);
app.use('/api/wishlist',wishlistRoute)
app.use('/api/cart', cartRoutes);

// Swagger UI route
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

app.use('/api',LoginByGoogleRoute)


export default app;
