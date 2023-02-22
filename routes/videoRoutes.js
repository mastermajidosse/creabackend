import cloudinary from 'cloudinary';
import express from 'express';
import multer from 'multer';
import fs from 'fs';
import { protect } from '../middlewares/authMiddleware.js';
import dotenv from 'dotenv';
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
var upload = multer({
  storage: storage,
});

router.post(
  '/single',
  protect,
  upload.single('file'),
  async (req, res, next) => {
    var mainFolderName = 'main';
    var locaFilePath = req.file.path;
    var filePathOnCloudinary = mainFolderName;

    cloudinary.v2.uploader
      .upload(locaFilePath, {
        resource_type: 'video',
        public_id: filePathOnCloudinary,
        chunk_size: 6000000,
        on: {
          progress: (progress) => {
            console.log(
              `Bytes uploaded: ${progress.bytesUploaded}, Progress: ${progress.percent}%`
            );
          },
        },
      })
      .then((result) => res.status(200).json({ url: result.url }))
      .catch((error) => res.status(401).json({ error: error }));
  }
);

export default router;
