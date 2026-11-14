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
| D019 | 2026-11-13 | Scale each cell to 10,000 counts and apply log1p | Standardize cell totals for exploratory expression analysis while retaining raw counts for inference | Applied |
| D020 | 2026-11-13 | Select 2,000 HVGs across pooled lanes after requiring detection in at least three cells | Establish a baseline representation for assessing lane and donor patterns | Applied |
| D021 | 2026-11-13 | Use centered PCA with ARPACK and retain 50 components | Preserve a range of components for diagnostic review and neighborhood construction | Applied |
| D022 | 2026-11-13 | Use the uncorrected PCA for initial clustering | Lane overlap on PC1–PC2 and limited donor-adjusted lane contributions support a baseline graph before assessing cluster composition | Accepted |
| D023 | 2026-11-14 | Build the baseline graph using the first 30 PCs, a neighborhood size of 15, and exact Euclidean search with scikit-learn | Use a local neighborhood in the retained PCA space. Exact search bypasses a compilation error on the approximate search path | Applied |
| D024 | 2026-11-14 | Use weighted Leiden at resolution 0.5 as the reference partition and compare 0.3 and 0.8 on the same graph | Retain the partition used for the initial composition review and assess how cluster membership changes with resolution | Applied |
| D025 | 2026-11-14 | Review clusters with at least 90% of cells from one donor across lanes and resolutions | Flag clusters where apparent condition enrichment may reflect the contribution of one donor and prioritize cross-donor marker review | Applied |
| D026 | 2026-11-14 | Rank candidate markers for each reference cluster against the remaining cells using Welch t scores on log-normalized expression | Screen the 32,801 expressed genes for annotation candidates. Assess marker profiles by donor before assigning labels | Applied |
| D027 | 2026-11-14 | Assign provisional labels using panels informed by Schmidt et al. and donor-level detection summaries | Record limited donor support where applicable and keep clusters 11 and 12 unresolved | Applied |
| D028 | 2026-11-14 | Use 20 cells per donor for descriptive coverage and assess NSC1-like coverage with and without cluster 10 | Quantify how donor contributions change when a donor-dominated cluster is excluded. Prespecify differential expression eligibility separately | Applied |
