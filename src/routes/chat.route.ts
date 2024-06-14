import { protectRoute } from "../middlewares/auth.middleware";
import { Router } from 'express'
import { viewAllMessage, createMessage } from "../controllers/chat.controller"; 

const postRoutes = Router();

postRoutes.get('/post', viewAllMessage);
postRoutes.post('/post/add', protectRoute, createMessage);

export default postRoutes