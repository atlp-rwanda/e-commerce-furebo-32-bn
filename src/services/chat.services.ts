import Posts from '../database/models/chat.model';

export const viewAllPosts = async () => {
  try {
    const posts = await Posts.findAll();
    return posts;
  } catch (error: any) {
    throw new Error(error.message || error);
  }
};

export const createPost = async (data: any) => {
  try {
    const newPost = await Posts.create(data);
    return newPost;
  } catch (error: any) {
    throw new Error(error.message || error);
  }
};