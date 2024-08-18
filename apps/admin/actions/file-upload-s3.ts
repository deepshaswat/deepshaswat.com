import { NextResponse } from "next/server";
import aws from "aws-sdk";
import { v4 as uuidv4 } from "uuid";

const s3 = new aws.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
  signatureVersion: "v4",
});

export async function POST(request: Request) {
  try {
    const { fileType } = await request.json();

    const key = `${uuidv4()}.${fileType.split("/")[1]}`;

    const s3Params = {
      Bucket: process.env.AWS_S3_BUCKET_NAME,
      Key: key,
      Expires: 60, // URL expires in 60 seconds
      ContentType: fileType,
      ACL: "public-read", // Make the file publicly readable
    };

    const uploadURL = await s3.getSignedUrlPromise("putObject", s3Params);

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
