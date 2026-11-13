# Report Build

The report builder reads the project charter for the research questions, statistical plan, sensitivity assessment, and completion criteria. It also reads the audit summary, the QC retention table, and the lane-level Scrublet figure when those outputs are available.

Use Node.js 24 and `docx` 9.6.1. Install the dependency locally with `npm install --no-save --package-lock=false docx@9.6.1`, then run `node scripts/build_project_report.cjs` from the project root. The generated file is `docs/project_report.docx`.

After updating the charter or decision log, synchronize the report's decision summary, regenerate the document, and inspect every rendered page before committing it. Word is a generated deliverable; Markdown and the builder preserve reviewable text changes.
