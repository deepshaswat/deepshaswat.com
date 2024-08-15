// try {
//   // Step 1: Get the signed URL from your API
//   const { data } = await axios.post("/api/upload", {
//     name: file.name,
//     type: file.type,
//   });

//   const { url } = data;

//   // Step 2: Upload the file to S3 using the signed URL
//   await axios.put(url, file, {
//     headers: {
//       "Content-Type": file.type,
//     },
//   });

//   console.log(`${file.name} uploaded successfully.`);
// } catch (error) {
//   console.error(`Error uploading ${file.name}: `, error);
// }

import { NextApiRequest, NextApiResponse } from "next";
import aws from "aws-sdk";
// import { v4 as uuidv4 } from "uuid";

// Initialize the S3 client
const s3 = new aws.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === "POST") {
    const { name, type } = req.body;

    // Generate a unique file name using UUID
    const fileId = ""; //uuidv4();
    const key = `uploads/${fileId}-${name}`;

    // Configure the S3 pre-signed URL parameters
    const params = {
      Bucket: process.env.AWS_S3_BUCKET_NAME!,
      Key: key,
      Expires: 60, // URL expiration time in seconds
      ContentType: type,
    };

    try {
      // Generate the pre-signed URL
      const uploadUrl = await s3.getSignedUrlPromise("putObject", params);

      // Return the pre-signed URL and the S3 URL for the file
      const imageUrl = `https://${process.env.AWS_S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;

      res.status(200).json({ uploadUrl, imageUrl });
    } catch (error) {
      console.error("Error generating pre-signed URL:", error);
      res.status(500).json({ error: "Failed to generate pre-signed URL" });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}
