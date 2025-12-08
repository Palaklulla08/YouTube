// importing cloudinary and fs modules
import { v2 as cloudinary } from 'cloudinary'
import fs from "fs"

// creatinf function to upload file to cloudinary
const uploadOnCloudinary = async (filePath) => {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });

  try {
    // if file path is not provided
    if (!filePath) return null;
    // uploading file to cloudinary
    const uploadResult = await cloudinary.uploader.upload(filePath, {
        // resouretype is auto weather it is image or video
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
// exporting default uploadOnCloudinary;
export default uploadOnCloudinary;
