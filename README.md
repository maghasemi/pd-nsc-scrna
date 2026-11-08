# pd-nsc-scrna

Parkinson's disease neural stem and precursor cell single-cell RNA-seq analysis.

![Analysis workflow](assets/readme/analysis_workflow.svg)

A statistical case study of single-cell RNA sequencing in iPSC-derived human neural precursor cells from sporadic Parkinson's disease and control donors.

**Status:** Project design. Data audit and analysis are pending.

## Research question

Which cell-state-specific expression and pathway differences distinguish sporadic Parkinson's disease from controls, and how consistent are these differences across donors and analytical choices?

## Study design

- Dataset: [GSE176160](https://www.ncbi.nlm.nih.gov/geo/query/acc.cgi?acc=GSE176160).
- Primary comparison: sporadic Parkinson's disease versus control in the patient-derived cohort.
- Published primary cohort: 7 disease and 5 control donors. Actual file contents and retained donor coverage will be audited.
- Candidate focus: NSC1a, subject to annotation evidence and donor coverage.
- Biological replicate: donor. Cells are nested observations.
- Scope: metadata audit, quality control, cell-state annotation, descriptive composition, differential expression, pathway analysis, and sensitivity analysis.

## Project layout

| Path | Contents |
| --- | --- |
| `config/` | Analysis settings and input metadata |
| `data/raw/` | Unmodified downloaded inputs, local only |
| `data/interim/` | Intermediate objects, local only |
| `data/processed/` | Annotated analysis objects, local only |
| `notebooks/` | Concise exploratory analyses |
| `scripts/` | Reusable analysis and reporting scripts |
| `workflow/` | Workflow orchestration added as analysis steps mature |
| `results/figures/` | Generated analytical figures |
| `results/tables/` | Generated statistical tables |
| `assets/readme/` | Curated graphics displayed on this page |
| `references/` | Bibliography, local PDFs, and supplementary material |
| `docs/` | Project charter, decision log, and versioned Word report |

## Reproducibility

Analysis commands and a locked analysis environment will be added with the first executable analysis milestone. The initial project report can be regenerated with `node scripts/build_project_report.cjs` after installing the exact `docx` version recorded in `docs/report_build.md`.

## Milestones

- [x] Define the statistical scope and repository structure.
- [ ] Audit metadata, donor assignments, and count matrices.
- [ ] Document QC and annotation decisions.
- [ ] Freeze the statistical analysis plan.
- [ ] Complete differential expression and pathway analyses.
- [ ] Assess sensitivity and deliver the statistical report.

## Reference

Schmidt S, Luecken MD, Trumbach D, et al. Primary cilia and SHH signaling impairments in human and mouse models of Parkinson's disease. Nature Communications. 2022;13:4819. [doi:10.1038/s41467-022-32229-9](https://doi.org/10.1038/s41467-022-32229-9).

The study and published code will be credited wherever reused. Reference files retain their original rights and attribution.
