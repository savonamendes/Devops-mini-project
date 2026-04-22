import {
  S3Client,
  PutObjectCommand,
  PutObjectCommandInput,
  DeleteObjectCommand,
  DeleteObjectCommandInput,
} from "@aws-sdk/client-s3";

// Initialize S3Client with explicit region and retry logic for better resiliency
const s3 = new S3Client({
  region: process.env.AWS_REGION || "us-east-1",
  maxAttempts: 3,
});

/**
 * Uploads a Buffer / Stream to S3 and returns the public URL.
 * `key` is the object key (path) inside the bucket.
 */
export async function uploadToS3(
  bucket: string,
  key: string,
  body: Buffer | Uint8Array | Blob | ReadableStream<any>,
  contentType: string
): Promise<string> {
  const params: PutObjectCommandInput = {
    Bucket: bucket,
    Key: key,
    Body: body,
    ContentType: contentType,
  };
  await s3.send(new PutObjectCommand(params));

  // Construct a simple HTTPS URL
  return `https://${bucket}.s3.${process.env.AWS_REGION || "us-east-1"}.amazonaws.com/${key}`;
}

/**
 * Deletes an object from S3.
 * `key` is the object key (path) inside the bucket.
 */
export async function deleteFromS3(bucket: string, key: string): Promise<void> {
  const params: DeleteObjectCommandInput = {
    Bucket: bucket,
    Key: key,
  };
  try {
    await s3.send(new DeleteObjectCommand(params));
  } catch (err) {
    console.error(`Failed to delete object ${key} from S3 bucket ${bucket}:`, err);
  }
}
