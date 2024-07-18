import cloudinary from "cloudinary"

export class imageServices {
      static obtainPublicId(cloudinaryUrl:string){
        const firstSplit=cloudinaryUrl.split('/')
        const pubicId=firstSplit[firstSplit.length-1].split('.')
        return pubicId[0]
      }
    static async uploadImages(imageFiles:Express.Multer.File[]){
        let imageUrls=[] as string[];
        let imagePublicId=[] as string[] ;
        await Promise.all(
            (imageFiles).map(
              async (file) => {
                const result = await cloudinary.v2.uploader.upload(file.path)
                imageUrls.push(result.secure_url);
                imagePublicId.push(result.public_id)
                return { secure_url: result.secure_url,pubic_id:result.public_id }
              },
            ),
          );
        return imageUrls;
      }
}
