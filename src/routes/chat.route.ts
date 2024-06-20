import { protectRoute } from "../middlewares/auth.middleware";
import { Router } from 'express'
import { viewAllMessage, createMessage } from "../controllers/chat.controller"; 

const chatRoutes = Router();

chatRoutes.get('/messages', viewAllMessage);
chatRoutes.post('/sendmessages', protectRoute, createMessage);

export default chatRoutes 