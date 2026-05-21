# Careers Form Changes Log

- **Date:** 2026-05-21
- **Author:** Automated changes by developer

## Summary
Removed the requirement that users must fill every field in the careers application form. Made corresponding JavaScript validation less strict so empty fields no longer block submission.

## Files modified
- `careers.html` — updated form fields and client-side validation logic.

## What changed (high level)
- Removed HTML `required` attributes from these fields:
  - `#full-name` (input)
  - `#email` (input type="email")
  - `#phone` (input type="tel")
  - `#college` (input)
  - `#year-of-study` (select)
  - `#degree` (input)
  - `#linkedin` (input type="url")
  - `#role-applying` (select)
  - `#why-join` (textarea)

- Relaxed JavaScript validators in the form submission handler:
  - Validators now allow empty values for previously required fields (treated as optional).
  - `year-of-study` and `role-applying` are explicitly treated as optional.
  - Resume upload is no longer required to submit the form; if absent it will not block submission.

## Why
The change makes the application flow less strict and allows users to submit partial applications. Server-side validation (if any) should still verify required information as appropriate.

## Notes & Next steps
- Consider adding visual "(Optional)" labels for fields that are not mandatory to avoid confusion.
- If you want, I can create a small UI hint update to show optional fields or commit these changes.

## Quick verification
To view the changes locally, run:

```bash
git diff -- cached
# or
git diff HEAD -- careers.html
```


---

If you'd like the changelog file named differently or to include a small unified diff, tell me and I will update it.