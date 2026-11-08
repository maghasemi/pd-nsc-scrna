# Statistical Analysis Charter

Version 0.1 | 8 November 2026 | Project design

## Objective

Characterize donor-consistent, cell-state-specific transcriptional differences between sporadic Parkinson's disease and control neural precursor cultures in GSE176160.

## Questions

1. Which populations and cell states are supported by marker expression and donor coverage?
2. Which states show disease-associated expression differences after accounting for biological replication?
3. Are cilia, SHH, and other pathway signals consistent across donors and analytical choices?

## Planned analysis

Audit counts and metadata before choosing thresholds. Preserve original counts and a record of excluded cells. Use Scanpy for cell-level exploration and annotation. Evaluate whether library effects require integration and assess whether integration changes biological structure. Preserve an uncorrected count representation for statistical testing.

Use donor-by-state pseudobulk counts with an edgeR quasi-likelihood model as the initial differential expression strategy. Its role is one inferential component of the single-cell project. Confirm adequate donor representation, model identifiability, and residual degrees of freedom before fitting. Additional covariates require metadata support and a full-rank design. Do not include donor identity as a fixed effect alongside condition in an unpaired donor-level comparison.

Use BH-adjusted p-values at FDR < 0.05 for the primary contrast in the selected state, with effect sizes and expression prevalence reported. Define the primary state and contrasts before disease differential expression. Additional states are secondary analyses with their multiple-testing family documented. Use ranked enrichment with versioned gene sets and a recorded tested-gene background for any overrepresentation analysis.

## Interpretation and sensitivity

Separate cell-state markers from disease differential expression. Assess donor representation, per-donor expression, QC threshold sensitivity, and cell-cycle-related structure. Inspect whether results depend on individual donors. Describe captured cell proportions as culture and sampling composition. Distinguish published findings, reproduced findings, and new observations.

## Scope and completion

Version 1 covers statistical single-cell analysis. Completion requires an auditable sample table, QC exclusions, supported annotations, justified statistical contrasts, full result tables, sensitivity analyses, and a rendered English report with limitations. Machine learning is reserved for a separate future scope decision.

## First review gate

Inspect the patient AnnData file. Verify count scale, unique cell identifiers, gene identifiers, donor labels, condition mapping, library labels, prior filtering, and cell-state metadata. Resolve these before executing QC or biological tests.
