import express, { Request, Response } from "express";
import userRoutes from "./routes/user.route";
import profileRoutes from "./routes/profile.routes";
import swaggerUi from "swagger-ui-express";
import specs from "../swagger.config";
import morgan from "morgan";
import cors from 'cors';
import bodyParser from "body-parser";
import productRoutes from "./routes/product.route";
import cartRoutes from "./routes/cart.route";
import collectionRoute from "./routes/collection.route";
import wishlistRoute from "./routes/wishlist.route";
import checkoutRoutes from "./routes/checkout.route";
import notificatioRoute from "./routes/notification.route";
import session from "express-session";
import passport from "passport";
import LoginByGoogleRoute from "../src/routes/Login-by-google.route";
import dotenv from "dotenv";
import productStatsRoute from "./routes/productStats.route";
import orderStatusroutes from "./routes/orderstatus.routes";
import { initSocket } from "./socketio";
import http from "http";
dotenv.config();
import chatRoutes from "./routes/chat.route";
import { createServer, Server as HTTPServer } from "http";
import { Server as SocketIOServer } from "socket.io";
import Emitter from "./events/emitter";



const app = express();

const server = http.createServer(app);
// Initialize Socket.IO
initSocket(server);

app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
}));

app.use(session({ secret: process.env.GOOGLE_SECRET2 as string }));
app.use(passport.initialize());
app.use(passport.session());

app.use(bodyParser.json());
app.use(express.json());
app.use(morgan("dev"));

app.use("/api", productRoutes);
app.use("/api", collectionRoute);
app.use("/api", orderStatusroutes);
app.get("/", (_req: Request, res: Response) => {
  return res.json({ message: "welcome to ATLP Backend APIs" });
});

app.use("/api/users", userRoutes);
app.use("/api/wishlist", wishlistRoute);
app.use("/api/stats", productStatsRoute);
app.use("/api/cart", cartRoutes);
app.use("/api/notifications", notificatioRoute);

app.use("/api/users", profileRoutes);
app.use("/api", checkoutRoutes);
app.use('/api/chats', chatRoutes)
// Swagger UI route
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));

app.use("/api", LoginByGoogleRoute);


export default app;
export { server };
