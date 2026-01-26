import crypto from "node:crypto";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { NextResponse } from "next/server";

interface UploadRequestBody {
  fileType: string;
}

// Initialize the S3 client
const s3 = new S3Client({
  region: process.env.AWS_REGION ?? "us-east-1",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID ?? "",
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY ?? "",
  },
});

export async function POST(request: Request): Promise<NextResponse> {
  try {
    const body = (await request.json()) as UploadRequestBody;
    const { fileType } = body;
    const fileExtension = fileType.split("/")[1] ?? "bin";
    const key = `${crypto.randomUUID()}.${fileExtension}`;

    // Create the command for the PUT operation
    const command = new PutObjectCommand({
      Bucket: process.env.AWS_S3_BUCKET_NAME ?? "",
      Key: key,
      ContentType: fileType,
    });

    // Generate the presigned URL
    const uploadURL = await getSignedUrl(s3, command, { expiresIn: 600 });

    return NextResponse.json({
      uploadURL,
      s3URL: `https://${process.env.AWS_S3_BUCKET_NAME ?? ""}.s3.amazonaws.com/${key}`,
    });
  } catch {
    return NextResponse.json(
      { error: "Failed to generate upload URL" },
      { status: 500 },
    );
  }
}
