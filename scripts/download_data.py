"""Retrieve and verify the published patient AnnData input."""

import gzip
import hashlib
import json
from pathlib import Path
import shutil
from urllib.request import urlopen

PROJECT_ROOT = Path(__file__).resolve().parents[1]


def file_sha256(path):
    digest = hashlib.sha256()
    with path.open('rb') as stream:
        for block in iter(lambda: stream.read(1024 * 1024), b''):
            digest.update(block)
    return digest.hexdigest()


def main():
    source = json.loads((PROJECT_ROOT / 'config/data_sources.json').read_text())
    raw_directory = PROJECT_ROOT / 'data/raw'
    raw_directory.mkdir(parents=True, exist_ok=True)
    archive = raw_directory / source['filename']
    if not archive.exists():
        temporary_archive = archive.with_suffix('.gz.part')
        with urlopen(source['url'], timeout=60) as response:
            with temporary_archive.open('wb') as destination:
                shutil.copyfileobj(response, destination)
        temporary_archive.replace(archive)
    archive_checksum = file_sha256(archive)
    expected_checksum = source['sha256']
    if expected_checksum and archive_checksum != expected_checksum:
        raise ValueError('Downloaded archive does not match the recorded SHA-256.')
    data_path = archive.with_suffix('')
    temporary_data = data_path.with_suffix('.h5ad.part')
    with gzip.open(archive, 'rb') as compressed:
        with temporary_data.open('wb') as destination:
            shutil.copyfileobj(compressed, destination)
    temporary_data.replace(data_path)
    manifest = {
        'accession': source['accession'],
        'url': source['url'],
        'archive': archive.name,
        'archive_bytes': archive.stat().st_size,
        'archive_sha256': archive_checksum,
        'uncompressed_file': data_path.name,
        'uncompressed_bytes': data_path.stat().st_size,
        'uncompressed_sha256': file_sha256(data_path),
    }
    output = PROJECT_ROOT / 'results/tables/input_manifest.json'
    output.parent.mkdir(parents=True, exist_ok=True)
    output.write_text(json.dumps(manifest, indent=2) + '\n')
    print(json.dumps(manifest, indent=2))


if __name__ == '__main__':
    main()
