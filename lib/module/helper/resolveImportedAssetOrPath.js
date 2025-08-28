"use strict";

import { resolveImportedAsset } from "./resolveImportedAsset.js";
export function resolveImportedAssetOrPath(pathOrAsset) {
  return pathOrAsset === undefined ? undefined : typeof pathOrAsset === "string" ? pathOrAsset : resolveImportedAsset(pathOrAsset);
}
//# sourceMappingURL=resolveImportedAssetOrPath.js.map