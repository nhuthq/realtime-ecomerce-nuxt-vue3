import fs from "fs";
import path from "path";
import multer from "multer";

import { PrismaClient } from "@prisma/client";
import { withAuth } from "../../../../utils/with-auth";
import { createError, defineEventHandler, readBody } from 'h3'

const prisma = new PrismaClient();

const storage = multer.diskStorage({
  destination: (req: any, file: any, cb: (...args: any[]) => any) => {
    const uploadDir = "./public/uploads/";

    // Create the upload directory if it doesn't exist
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req: any, file: any, cb: (...args: any[]) => any) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Unique filename
  },
});

const imageFileFilter = (req: any, file: any, cb: (...args: any[]) => any) => {
  const allowTypes = ["image/jpeg", "image/png", "image/jpg"];
  const isImage = allowTypes.includes(file.mimetype);

  if (isImage) {
    cb(null, true);
  } else {
    cb(new Error("Only image files are allowed"), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: imageFileFilter,
  limits: {
    fileSize: 2 * 1024 * 1024, // 2MB
  },
}).fields([
  { name: "file", maxCount: 1 },
  { name: "productId", maxCount: 1 },
]);

async function uploadProductImage(event: any) {
  return new Promise<{ imageUrl: string; productId: number }>(
    (resolve, reject) => {
      upload(event.req, event.res, async (err: any) => {
        if (err) {
          reject(err);
        }
        const file = event.req.files?.["file"]?.[0];
        const productId = Number(event.req.body?.productId);
        if (!file || !productId) {
          reject(new Error("Missing file or productId"));
          return;
        }
        const imageUrl = `/uploads/${file.filename}`;
        resolve({ imageUrl, productId });
      });
    },
  );
}

export default withAuth(async (event) => {
  try {
    const { imageUrl, productId } = await uploadProductImage(event);

    await prisma.image.create({
      data: {
        url: imageUrl,
        productId: productId,
      },
    });

    return {
      statusCode: 200,
      message: "Product images upload successfully!",
      url: imageUrl,
    };
  } catch (error) {
    console.log("ERROR: ", error);
    throw createError({
      statusCode: 500,
      message: "Something went wrong! Please try again.",
    });
  }
});
