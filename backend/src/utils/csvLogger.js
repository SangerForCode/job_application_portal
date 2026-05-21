const fs = require("fs");
const path = require("path");

const CSV_PATH = path.join(__dirname, "..", "data", "applications.csv");

const headers = [
  "submittedAt",
  "fullName",
  "email",
  "phoneCountryCode",
  "phone",
  "college",
  "yearOfStudy",
  "degree",
  "linkedinUrl",
  "portfolioUrl",
  "role",
  "skills",
  "whyJoin",
  "resumeS3Url"
];

function ensureCsvExists() {
  const dir = path.dirname(CSV_PATH);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  if (!fs.existsSync(CSV_PATH)) {
    fs.writeFileSync(CSV_PATH, `${headers.join(",")}\n`, "utf8");
  }
}

function escapeCsvValue(value) {
  const text = value == null ? "" : String(value);
  if (/[",\n]/.test(text)) {
    return `"${text.replace(/"/g, '""')}"`;
  }
  return text;
}

function appendApplication(application) {
  ensureCsvExists();

  const row = [
    application.submittedAt,
    application.fullName,
    application.email,
    application.phoneCountryCode,
    application.phone,
    application.college,
    application.yearOfStudy,
    application.degree,
    application.linkedinUrl,
    application.portfolioUrl,
    application.role,
    Array.isArray(application.skills) ? application.skills.join(" | ") : "",
    application.whyJoin,
    application.resumeS3Url
  ]
    .map(escapeCsvValue)
    .join(",");

  fs.appendFileSync(CSV_PATH, `${row}\n`, "utf8");
}

module.exports = {
  appendApplication,
  CSV_PATH
};
