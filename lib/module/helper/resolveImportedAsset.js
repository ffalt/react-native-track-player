"use strict";

import resolveAssetSource from "./resolveAssetSource.js";
export function resolveImportedAsset(id) {
  return id ? resolveAssetSource(id)?.uri ?? undefined : undefined;
}
//# sourceMappingURL=resolveImportedAsset.js.map