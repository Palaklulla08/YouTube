// import { v2 as cloudinary } from 'cloudinary'

// import fs from "fs"


// const uploadOnCloudinary = async (filePath) => {
//     cloudinary.config({ 
//   cloud_name: process.env.CLOUDINARY_NAME, 
//   api_key: process.env.CLOUDINARY_API_KEY, 
//   api_secret: process.env.CLOUDINARY_API_SECRET
// });

// try {
//     if(!filePath){
//         return null
//     }
//     const uploadResult = await cloudinary.uploader.upload(filePath,{resource_type:'auto'})
//     fs.unlinkSync(filePath)
//     return uploadResult.secure_url

// } catch (error) {
//     fs.unlinkSync(filePath)
//     console.log(error)
// }
// }

// export default uploadOnCloudinary

import { v2 as cloudinary } from 'cloudinary'
import fs from "fs"

const uploadOnCloudinary = async (filePath) => {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });

  try {
    if (!filePath) return null;

    const uploadResult = await cloudinary.uploader.upload(filePath, {
      resource_type: "auto",
    });

    // SAFE DELETE
    if (fs.existsSync(filePath)) {
      fs.unlink(filePath, (err) => {
        if (err) console.log("❌ Failed to delete file:", err);
      });
    }

    return uploadResult.secure_url;

  } catch (error) {
    // SAFE DELETE EVEN WHEN ERROR
    if (fs.existsSync(filePath)) {
      fs.unlink(filePath, () => {});
    }

    console.log("Cloudinary Upload Error:", error);
    return null;
  }
};

export default uploadOnCloudinary;
