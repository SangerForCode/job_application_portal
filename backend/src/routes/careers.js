const express = require("express");
const multer = require("multer");
const crypto = require("crypto");
const { PutObjectCommand } = require("@aws-sdk/client-s3");
const { createS3Client } = require("../config/s3");
const { appendApplication } = require("../utils/csvLogger");

const router = express.Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }
});

function sanitizeName(value) {
  return (
    String(value || "")
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "") || "applicant"
  );
}

function resolveResumeFolder(role) {
  const text = String(role || "").toLowerCase();

  if (text.includes("legal")) return "legal";
  if (text.includes("social")) return "social-media";
  if (text.includes("ui") || text.includes("ux")) return "uiux";
  if (text.includes("sales") || text.includes("product")) return "sales";

  return "sales";
}

function getFileExtension(filename) {
  const index = filename.lastIndexOf(".");
  if (index === -1) return "";
  return filename.substring(index).toLowerCase();
}

function createClientError(message) {
  const error = new Error(message);
  error.statusCode = 400;
  return error;
}

function ensureAllowedFile(file) {
  const ext = getFileExtension(file.originalname);
  const allowedExt = [".pdf", ".docx"];
  if (!allowedExt.includes(ext)) {
    throw createClientError("Only PDF and DOCX files are allowed.");
  }

  const mime = String(file.mimetype || "").toLowerCase();
  const allowedMime = [
    "application/pdf",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
  ];

  if (!allowedMime.includes(mime)) {
    throw createClientError("Invalid file type. Please upload PDF or DOCX.");
  }

  return ext;
}

router.post("/upload-resume", upload.single("resume"), async (req, res) => {
  try {
    const file = req.file;
    if (!file) {
      return res.status(400).json({ error: "Resume file is required." });
    }

    const ext = ensureAllowedFile(file);
    const applicantName = sanitizeName(req.body.applicantName);
    const role = req.body.role || "";
    const folder = resolveResumeFolder(role);
    const uniqueToken = `${Date.now()}-${crypto.randomUUID()}`;
    const key = `resume/${folder}/${applicantName}-${uniqueToken}${ext}`;

    const s3Client = createS3Client();

    await s3Client.send(
      new PutObjectCommand({
        Bucket: process.env.AWS_S3_BUCKET,
        Key: key,
        Body: file.buffer,
        ContentType: file.mimetype
      })
    );

    const resumeUrl = `https://${process.env.AWS_S3_BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;

    return res.status(201).json({
      success: true,
      resumeUrl,
      key,
      folder
    });
  } catch (error) {
    console.error("resume upload failed", error);

    if (error.statusCode) {
      return res.status(error.statusCode).json({ error: error.message });
    }

    return res.status(500).json({ error: error.message || "Failed to upload resume." });
  }
});

router.post("/submit", async (req, res) => {
  try {
    const payload = req.body || {};
    const application = {
      submittedAt: new Date().toISOString(),
      fullName: payload.fullName || "",
      email: payload.email || "",
      phoneCountryCode: payload.phoneCountryCode || "",
      phone: payload.phone || "",
      college: payload.college || "",
      yearOfStudy: payload.yearOfStudy || "",
      degree: payload.degree || "",
      linkedinUrl: payload.linkedinUrl || "",
      portfolioUrl: payload.portfolioUrl || "",
      role: payload.role || "",
      skills: Array.isArray(payload.skills) ? payload.skills : [],
      whyJoin: payload.whyJoin || "",
      resumeS3Url: payload.resumeFileUrl || ""
    };

    appendApplication(application);

    return res.status(201).json({ success: true });
  } catch (error) {
    console.error("submit failed", error);
    return res.status(500).json({ error: "Failed to save application." });
  }
});

module.exports = router;
