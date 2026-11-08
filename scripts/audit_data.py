"""Audit the patient input without modifying cells, genes, or counts."""

import json
from importlib.metadata import version
from pathlib import Path
import platform

import anndata as ad
import numpy as np
import pandas as pd

PROJECT_ROOT = Path(__file__).resolve().parents[1]


def main():
    source = json.loads((PROJECT_ROOT / 'config/data_sources.json').read_text())
    input_path = PROJECT_ROOT / 'data/raw' / source['filename'].removesuffix('.gz')
    output_directory = PROJECT_ROOT / 'results/tables'
    output_directory.mkdir(parents=True, exist_ok=True)
    adata = ad.read_h5ad(input_path, backed='r')
    try:
        required_columns = ['Donor', 'Lane', 'condition', 'age', 'gender', 'Demux_state']
        missing_columns = sorted(set(required_columns) - set(adata.obs.columns))
        if missing_columns:
            raise ValueError(f'Missing required metadata columns: {missing_columns}')
        if adata.obs[required_columns].isna().any().any():
            raise ValueError('Required metadata contain missing values.')
        donor_fields = ['condition', 'age', 'gender', 'years_of_illness']
        consistency = adata.obs.groupby('Donor', observed=True)[donor_fields].nunique(dropna=False)
        if (consistency > 1).any().any():
            raise ValueError('A donor has inconsistent clinical metadata.')
        donor_metadata = adata.obs[['Donor', *donor_fields]].drop_duplicates()
        donor_counts = adata.obs.groupby('Donor', observed=True).size().rename('n_cells')
        donor_metadata = donor_metadata.merge(donor_counts, on='Donor')
        donor_metadata['Donor'] = donor_metadata['Donor'].astype(str)
        donor_metadata = donor_metadata.sort_values('Donor')
        donor_metadata.to_csv(output_directory / 'donor_inventory.csv', index=False)
        lane_counts = adata.obs.groupby(['Donor', 'condition', 'Lane'], observed=True).size()
        lane_counts.rename('n_cells').reset_index().to_csv(
            output_directory / 'donor_lane_inventory.csv', index=False
        )
        metadata_schema = pd.DataFrame({
            'column': adata.obs.columns,
            'dtype': [str(adata.obs[column].dtype) for column in adata.obs],
            'n_unique': [adata.obs[column].nunique() for column in adata.obs],
            'n_missing': [adata.obs[column].isna().sum() for column in adata.obs],
        })
        metadata_schema.to_csv(output_directory / 'cell_metadata_schema.csv', index=False)

        total_counts = np.zeros(adata.n_obs, dtype=np.float64)
        detected_genes = np.zeros(adata.n_obs, dtype=np.int64)
        nonzero_entries = 0
        minimum_value = float('inf')
        maximum_value = float('-inf')
        all_integer_valued = True
        for block, start, stop in adata.chunked_X(chunk_size=256):
            if not np.isfinite(block).all():
                raise ValueError('The expression matrix contains non-finite values.')
            minimum_value = min(minimum_value, float(block.min()))
            maximum_value = max(maximum_value, float(block.max()))
            all_integer_valued = all_integer_valued and bool(np.equal(block, np.floor(block)).all())
            total_counts[start:stop] = block.sum(axis=1, dtype=np.float64)
            detected_genes[start:stop] = np.count_nonzero(block, axis=1)
            nonzero_entries += int(np.count_nonzero(block))
        cell_metrics = adata.obs[['Donor', 'condition', 'Lane']].copy()
        cell_metrics.index.name = 'cell_id'
        cell_metrics['total_counts'] = total_counts
        cell_metrics['n_genes_by_counts'] = detected_genes
        cell_metrics.to_csv(output_directory / 'input_cell_metrics.csv', index=True)
        cell_metrics.groupby('Donor', observed=True)[['total_counts', 'n_genes_by_counts']].median().to_csv(
            output_directory / 'donor_input_metrics.csv'
        )
        summary = {
            'input_file': input_path.name,
            'shape': {'n_cells': adata.n_obs, 'n_genes': adata.n_vars},
            'n_donors': len(donor_metadata),
            'donors_by_condition': donor_metadata['condition'].value_counts().to_dict(),
            'cells_by_condition': adata.obs['condition'].value_counts().to_dict(),
            'n_lanes': int(adata.obs['Lane'].nunique()),
            'demultiplexing_labels': adata.obs['Demux_state'].value_counts().to_dict(),
            'cell_ids_unique': adata.obs_names.is_unique,
            'gene_ids_unique': adata.var_names.is_unique,
            'matrix_storage': type(adata.X).__name__,
            'matrix_dtype': str(adata.X.dtype),
            'matrix_min': minimum_value,
            'matrix_max': maximum_value,
            'all_values_integer_valued': all_integer_valued,
            'zero_fraction': 1 - nonzero_entries / (adata.n_obs * adata.n_vars),
            'median_counts_per_cell': float(np.median(total_counts)),
            'median_genes_per_cell': float(np.median(detected_genes)),
            'empty_cells': int(np.count_nonzero(detected_genes == 0)),
            'named_layers': [name for name in adata.layers if name is not None],
            'has_raw_slot': adata.raw is not None,
            'unstructured_metadata': list(adata.uns),
            'embeddings': list(adata.obsm),
            'python_version': platform.python_version(),
            'package_versions': {name: version(name) for name in ['anndata', 'numpy', 'pandas', 'h5py', 'scipy']},
        }
        (output_directory / 'input_audit.json').write_text(json.dumps(summary, indent=2) + '\n')
        print(json.dumps(summary, indent=2))
    finally:
        adata.file.close()


if __name__ == '__main__':
    main()
