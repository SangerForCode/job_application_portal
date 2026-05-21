require("dotenv").config();

const express = require("express");
const cors = require("cors");
const path = require("path");
const careersRouter = require("./routes/careers");
const { getMissingEnv } = require("./config/s3");
const { CSV_PATH } = require("./utils/csvLogger");

const app = express();
const port = Number(process.env.PORT || 4000);

app.use(
  cors({
    origin: process.env.ALLOWED_ORIGIN || "*"
  })
);
app.use(express.json());

// Serve careers.html as the root
app.get("/", (_req, res) => {
  res.sendFile(path.join(__dirname, "../../careers.html"));
});

app.get("/health", (_req, res) => {
  const missingAwsEnv = getMissingEnv();
  res.json({
    ok: true,
    service: "careers-backend",
    csvDocumentPath: CSV_PATH,
    awsConfigured: missingAwsEnv.length === 0,
    missingAwsEnv
  });
});

app.use("/api/careers", careersRouter);

app.use((err, _req, res, _next) => {
  if (err && err.code === "LIMIT_FILE_SIZE") {
    return res.status(400).json({ error: "Resume size exceeds 5MB limit." });
  }
  console.error("unhandled error", err);
  return res.status(500).json({ error: "Internal server error" });
});

app.listen(port, () => {
  console.log(`Careers backend running on http://localhost:${port}`);
});
