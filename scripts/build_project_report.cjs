const fs = require('node:fs');
const path = require('node:path');
const { Document, Packer, Paragraph, TextRun, HeadingLevel, PageBreak, Table, TableRow, TableCell, WidthType, ShadingType, BorderStyle } = require('docx');
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
const widths = [1700, 7300];
const rows = [
    ['Stage', 'Reviewable output'],
    ['Input audit', 'Donor and library inventory; verified count representation'],
    ['QC and states', 'Exclusion ledger; cell-state evidence and donor coverage'],
    ['Inference', 'Expression contrasts; effect sizes and adjusted p-values'],
    ['Interpretation', 'Pathway results; donor-level expression summaries'],
    ['Sensitivity', 'Robustness assessment and final statistical report'],
];
const table = new Table({ width: { size: 9000, type: WidthType.DXA }, columnWidths: widths,
    rows: rows.map((row, index) => new TableRow({ tableHeader: index === 0,
        children: row.map((text, column) => new TableCell({
            width: { size: widths[column], type: WidthType.DXA },
            margins: { top: 120, bottom: 120, left: 140, right: 140 },
            borders: { top: border, bottom: border, left: border, right: border },
            shading: { type: ShadingType.CLEAR, fill: index === 0 ? '17364D' : index % 2 ? 'FFFFFF' : 'F0F5F8' },
            children: [new Paragraph({ children: [new TextRun({ text, bold: index === 0, color: index === 0 ? 'FFFFFF' : '202A35', size: 20 })] })],
        })),
    })),
});
const document = new Document({ creator: 'maghasemi', title: 'Parkinson Disease Neural Single Cell Analysis',
    description: 'Statistical analysis charter and project decisions',
    styles: { default: { document: { run: { font: 'Calibri', size: 22, color: '202A35' } },
        title: { run: { font: 'Calibri', size: 42, bold: true, color: '000000' }, paragraph: { spacing: { after: 220 } } },
        heading1: { run: { font: 'Calibri', size: 27, bold: true, color: '000000' }, paragraph: { spacing: { before: 240, after: 120 }, keepNext: true } },
    } },
    sections: [{ properties: { page: { size: { width: 11906, height: 16838 }, margin: { top: 1050, bottom: 1050, left: 1450, right: 1450 } } }, children: [
        new Paragraph({ text: 'Parkinson Disease Neural Single Cell Analysis', heading: HeadingLevel.TITLE }),
        paragraph('Statistical Analysis Charter | Version 0.1 | 8 November 2026'),
        ...section('Objective'), heading('Questions'), ...sections.get('Questions').split('\n').map(paragraph),
        heading('Study and analysis boundaries'),
        paragraph('GSE176160 contains neural precursor cultures profiled by single-cell RNA sequencing. The published sporadic disease comparison includes 7 patients and 5 controls. Pooled cells were assigned to donors using SNP-based demultiplexing. File-level verification is the first project milestone [1, 2].'),
        ...section('Scope and completion'),
        pageBreak(), heading('Planned analysis'),
        ...sections.get('Planned analysis').split('\n\n').map(paragraph),
        ...section('Interpretation and sensitivity'),
        heading('Analysis milestones'), table,
        pageBreak(), heading('Decision record'),
        paragraph('The current scope covers statistical single-cell analysis. Repository prose, code identifiers, figure text, and reports use English. Technical instruction is maintained in the project conversation. Concise comments explain intent where needed.'),
        paragraph('Donor is the biological replicate. NSC1a remains a candidate focus until annotation and donor coverage are verified. The differential expression method remains provisional until the count matrix and statistical design have been audited.'),
        paragraph('The initial local project name is pd-neural-single-cell. The remote repository name and visibility are pending owner selection. Downloaded reference PDFs remain local; their citations, source URLs, and checksums are versioned.'),
        ...section('First review gate'), heading('References'),
        paragraph('[1] Schmidt S, Luecken MD, Trumbach D, et al. Primary cilia and SHH signaling impairments in human and mouse models of Parkinson\'s disease. Nature Communications. 2022;13:4819. doi.org/10.1038/s41467-022-32229-9'),
        paragraph('[2] NCBI Gene Expression Omnibus. GSE176160. www.ncbi.nlm.nih.gov/geo/query/acc.cgi?acc=GSE176160'),
        paragraph('[3] Squair JW, et al. Confronting false discoveries in single-cell differential expression. Nature Communications. 2021;12:5692. doi.org/10.1038/s41467-021-25960-2'),
    ] }],
});
Packer.toBuffer(document).then(buffer => {
    const output = path.join(projectRoot, 'docs/project_report.docx');
    fs.writeFileSync(output, buffer);
    console.log(output);
});
