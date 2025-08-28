import { resolveImportedAsset } from "./resolveImportedAsset";

export function resolveImportedAssetOrPath(pathOrAsset: string | number | undefined): string | number | undefined {
  return pathOrAsset === undefined ?
    undefined :
    typeof pathOrAsset === "string" ? pathOrAsset : resolveImportedAsset(pathOrAsset);
}
