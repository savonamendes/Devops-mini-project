import {
  S3Client,
  PutObjectCommand,
  PutObjectCommandInput,
} from "@aws-sdk/client-s3";

const s3 = new S3Client({});

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
    ACL: "public-read",
  };
  await s3.send(new PutObjectCommand(params));

  // Construct a simple HTTPS URL (public bucket)
  return `https://${bucket}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;
}
