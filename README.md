# job_application_portal

Frontend careers page + backend APIs for:
- uploading resumes to Amazon S3
- saving all form responses in one CSV document

## Backend features
- `POST /api/careers/upload-resume`
  - accepts `resume` (`.pdf` or `.docx`, max 5MB)
  - uploads to S3 under role folders:
    - `resume/legal`
    - `resume/sales`
    - `resume/social-media`
    - `resume/uiux`
- `POST /api/careers/submit`
  - appends one row per application to:
    - `backend/src/data/applications.csv`
  - last CSV column is `resumeS3Url`

## Setup
1. Install dependencies:
   ```bash
   npm install
   ```
2. Create env file:
   ```bash
   cp .env.example .env
   ```
3. Fill `.env` values:
   - `PORT` (default `4000`)
   - `AWS_REGION`
   - `AWS_ACCESS_KEY_ID`
   - `AWS_SECRET_ACCESS_KEY`
   - `AWS_S3_BUCKET`
   - `ALLOWED_ORIGIN` (example: `http://127.0.0.1:8000`)

## Run
```bash
npm run dev
```

Health check:
- `GET http://localhost:4000/health`

## Frontend API config
`careers.html` is configured to call:
- `http://localhost:4000/api/careers/upload-resume`
- `http://localhost:4000/api/careers/submit`

## Single document for responses
All submissions are stored in:
- `backend/src/data/applications.csv`

Open this CSV in Excel/Google Sheets to review all responses. The final column is the S3 resume URL.
