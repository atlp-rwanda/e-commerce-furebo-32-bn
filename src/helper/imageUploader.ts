import cloudinary from "../config/claudinary";


const uploadFile = async (file:any) => {
  try {
    const upload = await cloudinary.uploader.upload(file.path);
    return upload.secure_url;
  } catch (error: any) {
    throw new Error(error.message);
  }
};

export default uploadFile;
