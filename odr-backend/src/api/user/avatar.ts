import { Response } from "express";
import { AuthRequest } from "../../types/auth";
import multer from "multer";
import { authenticateJWT } from "../../middleware/auth";
import { uploadToS3 } from "../../utils/s3";
import { AppError } from "../../middleware/appError";

const MAX_AVATAR_SIZE_MB = 2;

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: MAX_AVATAR_SIZE_MB * 1024 * 1024, // 2 MB
  },
  fileFilter: (_req, file, cb) => {
    const allowedTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new AppError(`Invalid file type. Only ${allowedTypes.join(", ")} are allowed.`, 400) as any);
    }
  },
});

/**
 * POST /api/user/avatar
 * Accepts a single file (`avatar`) and stores it in S3.
 * Returns the public URL which can be saved on the user profile.
 */
export async function uploadAvatarHandler(
  req: AuthRequest,
  res: Response
) {
  if (!req.file) {
    return res.status(400).json({ error: "No avatar file provided" });
  }

  const bucket = process.env.S3_BUCKET_NAME!;
  const key = `avatars/${req.user?.id}/${Date.now()}_${req.file.originalname.replace(/\s+/g, "_")}`;

  try {
    const url = await uploadToS3(
      bucket,
      key,
      req.file.buffer,
      req.file.mimetype
    );
    return res.json({ avatarUrl: url, key: key });
  } catch (err) {
    console.error("S3 upload error:", err);
    return res.status(500).json({ error: "Failed to upload avatar" });
  }
}

export default [
  authenticateJWT,
  (req: AuthRequest, res: Response, next: any) => {
    upload.single("avatar")(req, res, (err: any) => {
      if (err instanceof multer.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
          return res.status(400).json({ error: `File is too large. Max size is ${MAX_AVATAR_SIZE_MB}MB.` });
        }
        return res.status(400).json({ error: err.message });
      } else if (err) {
        // AppError from fileFilter
        return res.status(400).json({ error: err.message });
      }
      next();
    });
  },
  uploadAvatarHandler,
];
