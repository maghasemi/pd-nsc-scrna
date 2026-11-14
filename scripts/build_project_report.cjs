const fs = require('node:fs');
const path = require('node:path');
const { Document, Packer, Paragraph, TextRun, ImageRun, HeadingLevel, PageBreak, Table, TableRow, TableCell, WidthType, ShadingType, BorderStyle } = require('docx');
const projectRoot = path.resolve(__dirname, '..');
const charter = fs.readFileSync(path.join(projectRoot, 'docs/project_charter.md'), 'utf8');
const sections = new Map();
for (const block of charter.split('\n## ').slice(1)) {
    const [title, ...lines] = block.split('\n');
    sections.set(title.trim(), lines.join('\n').trim());
}
const paragraph = text => new Paragraph({ children: [new TextRun(text)], spacing: { after: 160, line: 280 } });
const heading = text => new Paragraph({ text, heading: HeadingLevel.HEADING_1 });
const section = title => [heading(title), ...sections.get(title).split('\n\n').map(paragraph)];
const pageBreak = () => new Paragraph({ children: [new PageBreak()] });
const border = { style: BorderStyle.SINGLE, size: 4, color: 'D9D9D9' };
const rows = [
    ['Stage', 'Reviewable output'],
    ['Input audit', 'Donor and library inventory; verified count representation'],
    ['QC and states', 'Exclusion ledger; cell-state evidence and donor coverage'],
    ['Inference', 'Expression contrasts; effect sizes and adjusted p-values'],
    ['Interpretation', 'Pathway results; donor-level expression summaries'],
    ['Sensitivity', 'Robustness assessment and final statistical report'],
];
const reportTable = (contents, widths) => new Table({
    width: { size: 9000, type: WidthType.DXA }, columnWidths: widths,
    rows: contents.map((row, index) => new TableRow({ tableHeader: index === 0,
        children: row.map((text, column) => new TableCell({
            width: { size: widths[column], type: WidthType.DXA },
            margins: { top: 120, bottom: 120, left: 140, right: 140 },
            borders: { top: border, bottom: border, left: border, right: border },
            shading: { type: ShadingType.CLEAR, fill: index === 0 ? '17364D' : index % 2 ? 'FFFFFF' : 'F0F5F8' },
            children: [new Paragraph({ children: [new TextRun({ text, bold: index === 0, color: index === 0 ? 'FFFFFF' : '202A35', size: 20 })] })],
        })),
    })),
});
const auditPath = path.join(projectRoot, 'results/tables/input_audit.json');
const auditPages = [];
if (fs.existsSync(auditPath)) {
    const audit = JSON.parse(fs.readFileSync(auditPath, 'utf8'));
    auditPages.push(
        pageBreak(), heading('Input data audit'),
        paragraph('GSE176160 patient input | Audit completed on 8 November 2026'),
        paragraph(`The input contains ${audit.shape.n_cells.toLocaleString('en-US')} cells and ${audit.shape.n_genes.toLocaleString('en-US')} genes from ${audit.n_donors} donors, comprising 7 Parkinson and 5 control donors across ${audit.n_lanes} libraries.`),
        heading('Matrix and identifiers'),
        paragraph(`The main matrix is dense ${audit.matrix_dtype}. All entries are finite, nonnegative, and integer-valued, with values from ${audit.matrix_min} to ${audit.matrix_max}. This is compatible with raw counts. Approximately ${(audit.zero_fraction * 100).toFixed(2)} percent of entries are zero. Cell and gene identifiers are unique.`),
        paragraph(`Median counts per cell are ${audit.median_counts_per_cell.toLocaleString('en-US')}; median detected genes are ${audit.median_genes_per_cell.toLocaleString('en-US')}. There are no empty cells. The file expands to 7.21 GB and was scanned in read-only 256-cell chunks.`),
        heading('Metadata and prior processing'),
        paragraph('Donor, library, disease condition, age, gender, and demultiplexing fields are present and complete. Years of illness is missing for controls. Every cell is labelled SNG, indicating upstream singlet selection. No cell-state labels or stored embeddings are present.'),
        heading('Review before quality control'),
        paragraph('Donor contributions range from 869 to 4,591 cells. The input contains 30,676 observations, compared with the published post-QC count of 30,557. The audit recorded the input cohort before applying the project-specific quality control criteria.'),
        paragraph('No cells or genes were removed or normalized during this audit. Detailed donor inventories, matrix summaries, provenance, and checksums are available in results/tables and docs/data_audit.md.'),
    );
}
const retentionPath = path.join(projectRoot, 'results/tables/qc_retention_by_condition.csv');
const qcPages = [];
if (fs.existsSync(retentionPath)) {
    const retentionRows = fs.readFileSync(retentionPath, 'utf8').trim().split(/\r?\n/).slice(1)
        .map(line => {
            const [condition, ...counts] = line.split(',');
            return [condition, ...counts.map(count => Number(count).toLocaleString('en-US'))];
        });
    qcPages.push(
        pageBreak(), heading('Cell quality control'),
        paragraph('The primary filter retained 30,589 cells and all 12 donors. It excluded 87 of 30,676 cells, or 0.28%, using two criteria: fewer than 1,000 detected genes or a mitochondrial count fraction of at least 15%. Twenty-five cells met the gene criterion, 67 met the mitochondrial criterion, and five met both.'),
        heading('Doublet screening'),
        paragraph('Scrublet [4] scored raw counts separately in each of the six lanes in Scanpy 1.12.5. The run used an expected doublet rate of 0.05, random seed 0, and automatic score thresholds of 0.526 to 0.535. It flagged 13 cells that passed the primary filter. The primary dataset retains these cells with their scores and flags. The sensitivity subset excludes them and retains 30,576 cells.'),
        heading('Cell retention by condition'),
        reportTable(
            [['Condition', 'Input', 'Primary', 'Sensitivity'], ...retentionRows],
            [2700, 1900, 2000, 2400],
        ),
        heading('Lane depth and next analysis'),
        paragraph('Within every donor, median total counts were lower in lanes 4–6 than in lanes 1–3. We will assess this pattern in normalized counts and cell-state representations. The filtered H5AD stores 58,735 genes at the original count scale. The cell decision table records the exclusion rules and sensitivity membership.'),
    );

    const figurePath = path.join(projectRoot, 'results/figures/qc_scrublet_scores_by_lane.png');
    if (fs.existsSync(figurePath)) {
        qcPages.push(
            pageBreak(), heading('Doublet score distributions by lane'),
            new Paragraph({
                children: [new ImageRun({
                    type: 'png',
                    data: fs.readFileSync(figurePath),
                    transformation: { width: 575, height: 749 },
                })],
                spacing: { after: 160 },
            }),
            paragraph('Figure 1. Observed scores are shown on a log-density scale. Simulated scores use a linear density scale. Red lines indicate the automatic thresholds used to flag cells for sensitivity analysis.'),
        );
    }
}
const pcaPages = [];
const pcaDiagnosticsPath = path.join(projectRoot, 'results/tables/pca_variance_and_lane.csv');
if (fs.existsSync(pcaDiagnosticsPath)) {
    pcaPages.push(
        pageBreak(), heading('Normalization and principal component analysis'),
        ...sections.get('Normalization and PCA').split('\n\n').map(paragraph),
        paragraph('All six lanes had median scaled totals of approximately 10,000 before log transformation. The detection criterion retained 32,801 of 58,735 genes for feature selection. PCA used 2,000 selected genes from all 30,589 cells. PC1 explained 10.14% of the variance and the first 10 components explained 38.84%.'),
        heading('Lane and donor patterns'),
        paragraph('Lane colors overlapped on PC1 and PC2. In a descriptive comparison of nested models, adding lane after donor explained at most 2.09% of the remaining variance, in PC37. That component accounted for 0.28% of the variance in the selected expression matrix.'),
        paragraph('Two control donors contributed 3,016 of the 6,118 cells in the lowest PC2 quintile. Within each of these donors, the pattern recurred across all six lanes. LUM and LGALS1 had negative PC2 loadings, while FABP7 had a positive loading. The marker pattern informs the subsequent annotation of cell states.'),
    );

    const figurePath = path.join(projectRoot, 'results/figures/pca_explained_variance.png');
    if (fs.existsSync(figurePath)) {
        pcaPages.push(
            new Paragraph({
                children: [new ImageRun({
                    type: 'png',
                    data: fs.readFileSync(figurePath),
                    transformation: { width: 575, height: 205 },
                })],
                spacing: { before: 160, after: 160 },
            }),
            paragraph('Figure 2. Variance explained by each principal component and cumulative variance across the 50 components.'),
        );
    }
}
const clusteringPages = [];
const resolutionPath = path.join(projectRoot, 'results/tables/cluster_resolution_summary.csv');
if (fs.existsSync(resolutionPath)) {
    const resolutionRows = fs.readFileSync(resolutionPath, 'utf8').trim().split(/\r?\n/).slice(1)
        .map(line => {
            const [resolution, clusters, flaggedClusters, flaggedCells, flaggedPercent] = line.split(',');
            return [resolution, clusters, flaggedClusters, Number(flaggedCells).toLocaleString('en-US'), `${Number(flaggedPercent).toFixed(2)}%`];
        });
    clusteringPages.push(
        pageBreak(),
        ...section('Neighborhood graph and clustering'),
        heading('Resolution sensitivity'),
        paragraph('The graph contained one connected component. At resolution 0.5, Leiden assigned 30,589 cells to 17 clusters. The table shows how many clusters met the 90% top-donor threshold and the share of all cells assigned to them.'),
        reportTable(
            [['Resolution', 'Clusters', 'Clusters meeting threshold', 'Cells in those clusters', 'Share of all cells'], ...resolutionRows],
            [1350, 1000, 2400, 2350, 1900],
        ),
        heading('Donor and lane composition'),
        paragraph('At resolution 0.5, the six clusters meeting the threshold were represented across all six lanes of their leading donors. For example, cluster 14 captured 90.0% to 96.0% of its leading donor’s cells in each lane. Clusters 14 and 6 had at least 96.7% overlap in both directions with their best matches at both comparison resolutions.'),
        paragraph('The UMAP shows regions dominated by individual donors, including in the condition panel. Evidence for disease-associated differences will require comparisons across donors within annotated cell states.'),
    );
    const figurePath = path.join(projectRoot, 'results/figures/umap_cluster_donor_lane_condition.png');
    if (fs.existsSync(figurePath)) {
        clusteringPages.push(
            pageBreak(), heading('UMAP by cluster donor lane and condition'),
            new Paragraph({
                children: [new ImageRun({
                    type: 'png',
                    data: fs.readFileSync(figurePath),
                    transformation: { width: 575, height: 293 },
                })],
                spacing: { after: 160 },
            }),
            paragraph('Figure 3. The same embedding is colored by reference Leiden cluster, donor, lane, and condition. Each point represents one cell. Cluster labels are provisional pending marker review.'),
        );
    }
}
const annotationPages = [];
const coveragePath = path.join(projectRoot, 'results/tables/cell_state_donor_coverage.csv');
if (fs.existsSync(coveragePath)) {
    const coverageRows = fs.readFileSync(coveragePath, 'utf8').trim().split(/\r?\n/).slice(1)
        .map(line => {
            const [state, cells, , controlDonors, , parkinsonDonors] = line.split(',');
            return [state, Number(cells).toLocaleString('en-US'), controlDonors, parkinsonDonors];
        });
    annotationPages.push(
        pageBreak(),
        ...section('Provisional cell state annotation'),
        heading('Donor coverage by state'),
        paragraph('Eight provisional cell-state labels cover 15 of the 17 clusters. The remaining 1,797 cells in clusters 11 and 12 are unresolved. Donor counts in the table include individuals with at least 20 cells in that state.'),
        reportTable(
            [['Provisional label', 'Cells', 'Control donors', 'Parkinson donors'], ...coverageRows],
            [4500, 950, 1700, 1850],
        ),
    );
    const figurePath = path.join(projectRoot, 'results/figures/cell_state_markers_by_cluster.png');
    if (fs.existsSync(figurePath)) {
        annotationPages.push(
            pageBreak(), heading('Markers and annotation sensitivity'),
            new Paragraph({
                children: [new ImageRun({
                    type: 'png',
                    data: fs.readFileSync(figurePath),
                    transformation: { width: 575, height: 358 },
                })],
                spacing: { after: 160 },
            }),
            paragraph('Figure 4. Points show the fraction of cells with detected expression and the mean log-normalized expression for each gene and reference cluster.'),
            paragraph('CENPF, AURKB, and CDC20 were detected in a larger fraction of cells in clusters 4 and 9 than in cluster 2 for all seven matched donors. All five cell-cycle markers in the panel showed higher detection in cluster 7 than in cluster 8 for all nine matched donors. These comparisons support the cycling NSC1-like and NSC2-like labels, respectively.'),
            paragraph('The NSC1-like group contains 6,595 cells across clusters 2, 5, and 10. Excluding cluster 10 reduces its control cells from 4,612 to 1,830 and its Parkinson cells from 1,983 to 1,958. The number of donors with at least 20 cells remains four controls and six Parkinson donors. A different control donor then contributes 86.0% of the remaining control cells, compared with a leading share of 60.5% before exclusion.'),
        );
    }
}
const document = new Document({ creator: 'maghasemi', title: 'Parkinson Disease Neural Single Cell Analysis',
    description: 'Statistical analysis charter and project decisions',
    styles: { default: { document: { run: { font: 'Calibri', size: 22, color: '202A35' } },
        title: { run: { font: 'Calibri', size: 42, bold: true, color: '000000' }, paragraph: { spacing: { after: 220 } } },
        heading1: { run: { font: 'Calibri', size: 27, bold: true, color: '000000' }, paragraph: { spacing: { before: 240, after: 120 }, keepNext: true } },
    } },
    sections: [{ properties: { page: { size: { width: 11906, height: 16838 }, margin: { top: 1050, bottom: 1050, left: 1450, right: 1450 } } }, children: [
        new Paragraph({ text: 'Parkinson Disease Neural Single Cell Analysis', heading: HeadingLevel.TITLE }),
        paragraph('Statistical Analysis Report | Version 0.6 | 14 November 2026'),
        ...section('Objective'), heading('Questions'), ...sections.get('Questions').split('\n').map(paragraph),
        heading('Study and analysis boundaries'),
        paragraph('GSE176160 contains neural precursor cultures profiled by single-cell RNA sequencing. The published sporadic disease comparison includes 7 patients and 5 controls. Pooled cells were assigned to donors using SNP-based demultiplexing. File-level verification is the first project milestone [1, 2].'),
        ...section('Scope and completion'),
        pageBreak(), heading('Planned analysis'),
        ...sections.get('Planned analysis').split('\n\n').map(paragraph),
        ...section('Interpretation and sensitivity'),
        heading('Analysis milestones'), reportTable(rows, [1700, 7300]),
        pageBreak(), heading('Decision record'),
        paragraph('The current scope covers statistical single-cell analysis. Repository prose, code identifiers, figure text, and reports use English. Technical instruction is maintained in the project conversation. Concise comments explain intent where needed.'),
        paragraph('Donor is the biological replicate. The NSC1-like group is the candidate for the primary contrast. Donor eligibility and the differential expression model will be finalized in the statistical analysis plan.'),
        paragraph('The project repository is pd-nsc-scrna. The owner selected a private repository for development and review before a future public release. Downloaded reference PDFs remain local; their citations, source URLs, and checksums are versioned.'),
        ...section('First review gate'), heading('References'),
        paragraph('[1] Schmidt S, Luecken MD, Trumbach D, et al. Primary cilia and SHH signaling impairments in human and mouse models of Parkinson\'s disease. Nature Communications. 2022;13:4819. doi.org/10.1038/s41467-022-32229-9'),
        paragraph('[2] NCBI Gene Expression Omnibus. GSE176160. www.ncbi.nlm.nih.gov/geo/query/acc.cgi?acc=GSE176160'),
        paragraph('[3] Squair JW, et al. Confronting false discoveries in single-cell differential expression. Nature Communications. 2021;12:5692. doi.org/10.1038/s41467-021-25960-2'),
        paragraph('[4] Wolock SL, Lopez R, Klein AM. Scrublet: Computational Identification of Cell Doublets in Single-Cell Transcriptomic Data. Cell Systems. 2019;8(4):281–291.e9. doi.org/10.1016/j.cels.2018.11.005'),
        ...auditPages,
        ...qcPages,
        ...pcaPages,
        ...clusteringPages,
        ...annotationPages,
    ] }],
});
Packer.toBuffer(document).then(buffer => {
    const output = path.join(projectRoot, 'docs/project_report.docx');
    fs.writeFileSync(output, buffer);
    console.log(output);
});
