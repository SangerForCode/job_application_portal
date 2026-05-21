const { S3Client } = require("@aws-sdk/client-s3");

const requiredEnv = [
  "AWS_REGION",
  "AWS_ACCESS_KEY_ID",
  "AWS_SECRET_ACCESS_KEY",
  "AWS_S3_BUCKET"
];

function getMissingEnv() {
  return requiredEnv.filter((name) => !process.env[name]);
}

function createS3Client() {
  return new S3Client({
    region: process.env.AWS_REGION,
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
    }
  });
}

module.exports = {
  createS3Client,
  getMissingEnv
};
