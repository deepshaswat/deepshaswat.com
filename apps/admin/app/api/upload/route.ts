"use server";

import { NextResponse } from "next/server";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { v4 as uuidv4 } from "uuid";

// Initialize the S3 client
const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

export async function POST(request: Request) {
  try {
    const { fileType } = await request.json();
    const fileExtension = fileType.split("/")[1];
    // const key = `${uuidv4()}.${fileType.split("/")[1]}`;
    const key = `${uuidv4()}.${fileExtension}`;

    // Create the command for the PUT operation
    const command = new PutObjectCommand({
      Bucket: process.env.AWS_S3_BUCKET_NAME as string,
      Key: key,
      ContentType: fileType,
    });

    // Generate the presigned URL
    const uploadURL = await getSignedUrl(s3, command, { expiresIn: 600 });

    return NextResponse.json({
      uploadURL,
      s3URL: `https://${process.env.AWS_S3_BUCKET_NAME}.s3.amazonaws.com/${key}`,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to generate upload URL" },
      { status: 500 },
    );
  }
}
