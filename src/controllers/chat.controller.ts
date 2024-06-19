import { Request, Response } from 'express';
import { viewAllPosts, createPost } from '../services/chat.services';
import { eventEmitter } from '../app';

export const createMessage = async (req: Request, res: Response) => {
  try {
    // @ts-ignore
    const  user  = req.user;
    const { content } = req.body;

    const message = {
      userId: user.id,
      name: user.firstName,
      content,
    };

    const newMessage = await createPost(message);
    eventEmitter.emit("sendmessage", newMessage);
    return res.status(200).json(newMessage);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};

export const viewAllMessage = async (_req: Request, res: Response) => {
  try {
    const posts = await viewAllPosts();
    return res.status(200).json(posts);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};