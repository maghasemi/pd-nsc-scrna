# Statistical Analysis Charter

Version 0.4 | 14 November 2026 | Clustering and donor composition review complete

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

## Cell quality control

Apply the primary cell filter to the audited counts. Exclude cells with fewer than 1,000 detected genes or at least 15% mitochondrial counts. Run Scrublet independently for each lane and preserve its scores and calls. Use the primary cohort for the main analysis and exclude Scrublet-flagged cells in a sensitivity analysis. Preserve the original count scale in the filtered matrix and audit lane-associated depth during normalization and annotation.

## Normalization and PCA

Scale each cell to 10,000 counts and apply log1p for exploratory expression analysis. Restrict HVG eligibility to genes detected in at least three cells. Select 2,000 HVGs across pooled lanes using Seurat dispersion and compute 50 centered PCs using ARPACK. Preserve raw counts for count-based inference. Use the uncorrected PCA for the first neighborhood graph and assess the representation of donors and lanes across clusters.

## Neighborhood graph and clustering

Build a graph from the first 30 uncorrected PCs with a neighborhood size of 15, exact Euclidean search via scikit-learn, and UMAP connectivity weights. Use weighted, undirected Leiden with igraph, two iterations, and seed 0. Use resolution 0.5 as the reference and compare membership at 0.3 and 0.8 on the same graph. Compute a two-dimensional UMAP with minimum distance 0.5 and seed 0 for visualization.

Use a 90% top-donor share as a descriptive threshold. Compare this share with the donor's contribution to the full dataset. Within each flagged cluster's leading donor, calculate the fraction of cells in the cluster separately for each lane. Interpret the resulting groups using marker expression and donor coverage before assigning biological labels.
