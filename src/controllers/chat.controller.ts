import { Request, Response } from 'express';
import { viewAllPosts, createPost, deleteAllPosts, deletePost } from '../services/chat.services';

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
}


export const deleteSingleMessage = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const deleted = await deletePost(id);
    if (deleted) {
      return res.status(200).json({ message: 'Post deleted successfully' });
    } else {
      return res.status(404).json({ message: 'Post not found' });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};

export const deleteAllMessages = async (_req: Request, res: Response) => {
  try {
    await deleteAllPosts();
    return res.status(200).json({ message: 'All posts deleted successfully' });
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};