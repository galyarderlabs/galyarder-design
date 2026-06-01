#!/usr/bin/env bash
# .github/scripts/release/github/upload-release-assets.sh
set -euo pipefail

# Verify required environment variables
for name in VERSION_TAG GITHUB_REPOSITORY RUNNER_TEMP; do
  if [ -z "${!name:-}" ]; then
    echo "$name is required" >&2
    exit 1
  fi
done

release_root="${RELEASE_ROOT:-$RUNNER_TEMP/release-assets}"

echo "[github-upload] Scanning for packaged assets to upload in: $release_root"

if [ -d "$release_root" ]; then
  # Locate all built installers, executables, AppImages, zip archives, and checksum files
  # and upload them directly to the target GitHub Release tag.
  uploaded_count=0
  while IFS= read -r -d '' file_path; do
    echo "[github-upload] Uploading asset: $(basename "$file_path") to release $VERSION_TAG..."
    gh release upload "$VERSION_TAG" "$file_path" --repo "$GITHUB_REPOSITORY" --clobber
    uploaded_count=$((uploaded_count + 1))
  done < <(find "$release_root" -type f \( -name "*.dmg" -o -name "*.exe" -o -name "*.AppImage" -o -name "*.zip" -o -name "*.sha256" \) -print0 | sort -z)
  
  echo "[github-upload] Successfully uploaded $uploaded_count assets to GitHub Release $VERSION_TAG."
else
  echo "[github-upload] Error: Release assets directory not found at $release_root" >&2
  exit 1
fi
