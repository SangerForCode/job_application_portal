require("dotenv").config();
const { S3Client, ListObjectsV2Command } = require("@aws-sdk/client-s3");

async function checkS3() {
  const client = new S3Client({
    region: process.env.AWS_REGION,
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
    }
  });

  try {
    console.log(`Checking bucket: ${process.env.AWS_S3_BUCKET} in region: ${process.env.AWS_REGION}`);
    const command = new ListObjectsV2Command({
      Bucket: process.env.AWS_S3_BUCKET,
      MaxKeys: 10
    });
    const response = await client.send(command);
    
    if (response.Contents) {
      console.log("Recent files found in bucket:");
      response.Contents.sort((a, b) => b.LastModified - a.LastModified).forEach(item => {
        console.log(` - ${item.Key} (Modified: ${item.LastModified})`);
      });
    } else {
      console.log("Bucket is empty or no files found.");
    }
  } catch (err) {
    console.error("Error connecting to S3:", err.message);
  }
}

checkS3();
