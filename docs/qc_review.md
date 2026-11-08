# Preliminary Quality Control Review

8 November 2026

## Input and assessment

The patient dataset contains 30,676 cells from 12 donors, including seven Parkinson's disease donors and five controls. Cell-level QC metrics were calculated in 256-cell chunks and linked to donor, condition, and lane metadata using unique cell identifiers.

The assessment covers total counts, detected genes, mitochondrial count fractions, and their distributions across donors and lanes.

## Donor-level findings

Donor UKERi82A-R1-002 has the highest median mitochondrial fraction at 3.02%, with a 99th percentile of 17.58%. Its central count and gene-detection distributions do not show an obvious corresponding depletion.

Cells with very high total counts occur across multiple donors and lanes. Their doublet status remains unresolved.

## Provisional filtering scenario

A scenario combining fewer than 1,000 detected genes or a mitochondrial fraction of at least 15% flags 87 cells, representing 0.28% of the input.

Twenty-five cells meet the gene criterion, 67 meet the mitochondrial criterion, and five meet both. This scenario would retain 30,589 cells and all 12 donors. Donor-level flagged fractions range from approximately 0.09% to 1.38%.

These thresholds remain provisional. Filtering has not been applied.

## Lane-associated variation

Median total counts are consistently lower in lanes 4-6 than in lanes 1-3 within all 12 donors. This pattern warrants further assessment during normalization and examination of cell-state structure.

## Outputs and next steps

QC tables and figures are stored under results/tables and results/figures. Further assessment will address high-count cells, potential doublets, and sensitivity to filtering choices before finalizing exclusions.

The active notebook environment is stored on the internal drive at ~/.venvs/pd-nsc-scrna and uses Python 3.12.2.
