import { protectRoute } from "../middlewares/auth.middleware";
import { Router } from 'express'
import { viewAllMessage, createMessage, deleteSingleMessage, deleteAllMessages } from "../controllers/chat.controller"; 

const chatRoutes = Router();

chatRoutes.get('/messages', viewAllMessage);
chatRoutes.post('/sendmessages', protectRoute, createMessage);
chatRoutes.delete('/messages/:id', protectRoute, deleteSingleMessage);
chatRoutes.delete('/messages', protectRoute, deleteAllMessages);

export default chatRoutes 