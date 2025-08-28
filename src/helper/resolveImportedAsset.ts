import resolveAssetSource from "./resolveAssetSource";

export function resolveImportedAsset(id?: number) {
  return id
    ? ((resolveAssetSource(id)?.uri as string | null) ?? undefined)
    : undefined;
}
