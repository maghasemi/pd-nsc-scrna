# Decision Log

| ID | Date | Decision | Rationale | Status |
| --- | --- | --- | --- | --- |
| D001 | 2026-11-08 | Limit version 1 to statistical single-cell analysis | Establish biological and statistical evidence before extending scope | Accepted |
| D002 | 2026-11-08 | Use English throughout repository and reports | Maintain a consistent professional deliverable | Accepted |
| D003 | 2026-11-08 | Keep instruction and detailed teaching in the project conversation | Keep code comments concise and focused on intent | Accepted |
| D004 | 2026-11-08 | Audit published AnnData before choosing thresholds | The filename alone does not establish count scale or preprocessing history | Completed |
| D005 | 2026-11-08 | Treat donor as the biological replicate | Preserve the dependency structure of single-cell observations | Accepted |
| D006 | 2026-11-08 | Consider NSC1a as the primary state | Published biological context provides a prespecified candidate; coverage must support inference | Provisional |
| D007 | 2026-11-08 | Use donor-by-state counts and edgeR for primary DE | Obtain replicate-aware expression contrasts | Provisional |
| D008 | 2026-11-08 | Keep downloaded papers locally and track their bibliography | Preserve access and attribution while keeping repository history compact | Accepted |
| D009 | 2026-11-08 | Name the repository pd-nsc-scrna and keep it private during development | Owner selection | Accepted |
| D010 | 2026-11-08 | Use the SSD workspace as the active project location | Follow the current project workspace and preserve the initial Git history | Accepted |
| D011 | 2026-11-08 | Audit only the published patient AnnData file at this milestone | Keep the primary sporadic disease cohort distinct from the cell-line experiment | Accepted |
| D012 | 2026-11-08 | Read the dense input in 256-cell chunks using read-only backing | Bound memory use while inspecting every matrix value | Accepted |
| D013 | 2026-11-08 | Use Python 3.12 and a hash-locked AnnData environment | Record executable dependencies for the audit milestone | Accepted |
| D014 | 2026-11-08 | Retain all downloaded observations during the audit | Apply QC only after reviewing input quality distributions and upstream singlet selection | Accepted |
| D015 | 2026-11-13 | Exclude cells with fewer than 1,000 detected genes or at least 15% mitochondrial counts | The rule flags 87 cells in the distribution tails and retains all 12 donors | Applied |
| D016 | 2026-11-13 | Run Scrublet separately within each lane using raw counts and automatic thresholds | Lane-specific simulation respects the capture design and complements upstream Demuxlet selection | Completed |
| D017 | 2026-11-13 | Retain the 13 Scrublet-flagged cells in the primary dataset and exclude them in a sensitivity analysis | The observed and simulated score distributions overlap and the calls are uncertain | Applied |
| D018 | 2026-11-13 | Preserve raw counts in the filtered H5AD and record lane depth differences | The next stage can assess whether normalization reduces the lane-associated pattern | Applied |
