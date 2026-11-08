# Input Data Audit

8 November 2026 | GSE176160 | Patient-derived cohort

## Input and provenance

The official GEO patient AnnData archive was downloaded without modification. The archive and expanded file checksums are recorded in `results/tables/input_manifest.json`. `config/data_sources.json` pins the first observed archive checksum for subsequent downloads. This is a locally recorded reproducibility checksum, not an independent publisher-signed integrity certificate.

The archive occupies 237,534,119 bytes and expands to 7,211,736,132 bytes. The input remains local under `data/raw/` and is excluded from Git.

## Verified structure

| Property | Observed value |
| --- | --- |
| Cells | 30,676 |
| Genes | 58,735 |
| Donors | 12, comprising 7 Parkinson and 5 Control |
| Libraries recorded as Lane | 6 |
| Parkinson cells | 18,967 |
| Control cells | 11,709 |
| Main matrix | Dense float32 |
| Matrix value range | 0 to 7,486 |
| Integer-valued and finite | All entries |
| Zero entries | 94.04% |
| Median counts per cell | 12,357 |
| Median detected genes per cell | 3,473 |
| Unique cell and gene identifiers | Yes |
| Empty cells | 0 |
| Named supplementary layers | None |
| Raw slot and stored embeddings | Absent |

The nonnegative integer-valued matrix is compatible with raw counts. Integer-valued float storage is not evidence of normalization. The audit does not independently reconstruct upstream alignment or UMI processing.

## Metadata and upstream selection

Available observation fields are `Demux_state`, `Donor`, `Lane`, `condition`, `age`, `years_of_illness`, and `gender`. Required donor, condition, age, gender, lane, and demultiplexing fields are complete. Clinical metadata are consistent within donors. Years of illness is missing for controls, which is expected and must not be replaced with a disease duration.

All observations have the `SNG` label. The input has already undergone upstream singlet selection. It is not an unfiltered droplet matrix. No cell-state annotations, variable metadata columns, stored normalization history, or embeddings are present.

## Interpretation and next review

Donor cell counts range from 869 to 4,591. Subsequent QC summaries must retain donor-level visibility. The downloaded 30,676 cells differ from the 30,557 cells reported after QC in the article. The input-to-analysis filtering history will be documented rather than forcing the input to match the published final count.

The next milestone will calculate mitochondrial fractions, inspect per-donor count and gene distributions, and propose justified exclusion thresholds. No cells or genes have been removed, normalized, or annotated in this milestone. NSC1a coverage remains unknown until annotation.

## Reproduction

Run the download and audit commands in the README. The full matrix was scanned using read-only AnnData backing in 256-cell chunks. See `input_audit.json`, `cell_metadata_schema.csv`, `donor_inventory.csv`, `donor_lane_inventory.csv`, `input_cell_metrics.csv`, and `donor_input_metrics.csv` under `results/tables/`.

## Sources

- Schmidt et al. 2022. https://doi.org/10.1038/s41467-022-32229-9
- GEO input directory. https://ftp.ncbi.nlm.nih.gov/geo/series/GSE176nnn/GSE176160/suppl/
- AnnData documentation. https://anndata.readthedocs.io/en/stable/generated/anndata.AnnData.html
