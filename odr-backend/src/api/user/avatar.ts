import { Response } from "express";
import { AuthRequest } from "../../types/auth";
import multer from "multer";
import { authenticateJWT } from "../../middleware/auth";
import { uploadToS3 } from "../../utils/s3";

const upload = multer({ storage: multer.memoryStorage() });

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
    return res
      .status(400)
      .json({ error: "No avatar file provided" });
  }

  const bucket = process.env.S3_BUCKET_NAME!;
  const key = `avatars/${req.user?.id}/${Date.now()}_${req.file.originalname}`;

  try {
    const url = await uploadToS3(
      bucket,
      key,
      req.file.buffer,
      req.file.mimetype
    );
    return res.json({ avatarUrl: url });
  } catch (err) {
    console.error("S3 upload error:", err);
    return res
      .status(500)
      .json({ error: "Failed to upload avatar" });
  }
}

export default [
  authenticateJWT,
  upload.single("avatar"),
  uploadAvatarHandler,
];
