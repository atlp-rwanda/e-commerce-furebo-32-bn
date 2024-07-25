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


export const deletePost = async (postId: string) => {
  try {
    const deleted = await Posts.destroy({ where: { id: postId } });
    return deleted;
  } catch (error: any) {
    throw new Error(error.message || error);
  }
};

export const deleteAllPosts = async () => {
  try {
    const deleted = await Posts.destroy({ where: {}, truncate: true });
    return deleted;
  } catch (error: any) {
    throw new Error(error.message || error);
  }
};