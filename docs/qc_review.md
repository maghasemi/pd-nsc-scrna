# Cell Quality Control Review

13 November 2026

## Input and assessment

The patient dataset contains 30,676 cells from 12 donors, including seven Parkinson's disease donors and five controls. Cell-level QC metrics were calculated in 256-cell chunks and linked to donor, condition, and lane metadata using unique cell identifiers.

The assessment covers total counts, detected genes, mitochondrial count fractions, and their distributions across donors and lanes.

## Donor-level findings

Donor UKERi82A-R1-002 has the highest median mitochondrial fraction at 3.02%, with a 99th percentile of 17.58%. Its central count and gene-detection distributions do not show an obvious corresponding depletion.

Cells with very high total counts occur across multiple donors and lanes. Their doublet status remains unresolved.

## Primary cell filter

A filter combining fewer than 1,000 detected genes or a mitochondrial fraction of at least 15% excluded 87 cells, representing 0.28% of the input.

Twenty-five cells met the gene criterion, 67 met the mitochondrial criterion, and five met both. The primary filter retained 30,589 cells and all 12 donors. Donor-level exclusion fractions ranged from approximately 0.09% to 1.38%.

## Doublet review and sensitivity analysis

Scrublet (Wolock et al. 2019) scored the raw counts independently for each of the six lanes in Scanpy 1.12.5. The run used an expected doublet rate of 0.05, a random seed of 0, and automatic thresholds. The thresholds ranged from 0.526 to 0.535. Scrublet flagged 13 additional cells, none of which met the primary exclusion criteria.

The simulated and observed score distributions overlap. The primary dataset retains the 13 cells and records their scores and flags. A sensitivity subset excludes them and retains 30,576 cells.

## Lane-associated variation

Median total counts are consistently lower in lanes 4-6 than in lanes 1-3 within all 12 donors. This pattern warrants further assessment during normalization and examination of cell-state structure.

## Outputs and next steps

The verified count matrix is stored locally at `data/interim/GSE176160_patients_qc.h5ad`. The [cell decisions](../results/tables/cell_qc_decisions.csv), [retention table](../results/tables/qc_retention_by_condition.csv), and [Scrublet figure](../results/figures/qc_scrublet_scores_by_lane.png) document the applied filter and sensitivity subset. The next stage will normalize the counts and assess lane-associated variation in cell-state structure.

Wolock SL, Lopez R, Klein AM. Scrublet: Computational Identification of Cell Doublets in Single-Cell Transcriptomic Data. Cell Systems. 2019;8(4):281–291.e9. [doi:10.1016/j.cels.2018.11.005](https://doi.org/10.1016/j.cels.2018.11.005).

The active notebook environment is stored on the internal drive at ~/.venvs/pd-nsc-scrna and uses Python 3.12.2.
