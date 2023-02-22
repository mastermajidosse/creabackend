import cloudinary from 'cloudinary';
import express from 'express';
import multer from 'multer';
import fs from 'fs';
import dotenv from 'dotenv';
import { protect } from '../middlewares/authMiddleware.js';
dotenv.config();
const router = express.Router();

cloudinary.config({
  cloud_name: process.env.cloud_name?.toString(),
  api_key: process.env.api_key?.toString(),
  api_secret: process.env.api_secret?.toString(),
});
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './uploads');
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});
var upload = multer({ storage: storage });

async function uploadToCloudinary(locaFilePath) {
  // locaFilePath :
  // path of image which was just uploaded to "uploads" folder

  var mainFolderName = 'main';
  // filePathOnCloudinary :
  // path of image we want when it is uploded to cloudinary
  var filePathOnCloudinary = mainFolderName + '/' + locaFilePath;

  return cloudinary.uploader
    .upload(locaFilePath, { public_id: filePathOnCloudinary })
    .then((result) => {
      // Image has been successfully uploaded on cloudinary
      // So we dont need local image file anymore
      // Remove file from local uploads folder
      fs.unlinkSync(locaFilePath);

      return {
        message: 'Success',
        url: result.url,
      };
    })
    .catch((error) => {
      // Remove file from local uploads folder
      fs.unlinkSync(locaFilePath);
      return { message: 'Fail' };
    });
}

router.post(
  '/single',
  protect,
  upload.single('file'),
  async (req, res, next) => {
    // req.file is the `profile-file` file
    // req.body will hold the text fields, if there were any
    var locaFilePath = req.file.path;
    var result = await uploadToCloudinary(locaFilePath);
    res.json(result.url);
  }
);

export default router;
