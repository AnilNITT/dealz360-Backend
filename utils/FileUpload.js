var cloudinary = require("cloudinary")
// import { Files } from 'formidable';

const Cloudinary = cloudinary.v2;
Cloudinary.config({
  cloud_name: process.env.cloud_name || "dsf06urnv",
  api_key: process.env.api_key || "977216532728125",
  api_secret: process.env.api_secret || "OayhskPJzuM-C8mWy9hUVWirawQ",
});

export const cloudinaryImageUploadMethod = async (file) => {
  return new Promise(resolve => {
    Cloudinary.uploader.upload(file, (err, res) => {
      if (err) return res.status(500).send('upload image error');
      resolve(res.secure_url);
    });
  });
};