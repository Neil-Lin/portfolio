import { eventHandler, createError } from 'h3';
import { withLeadingSlash, withoutTrailingSlash, parseURL } from 'ufo';
import { promises } from 'fs';
import { resolve, dirname } from 'pathe';
import { fileURLToPath } from 'url';

const assets = {
  "/index.html": {
    "type": "text/html; charset=utf-8",
    "etag": "\"549-u3LFzj+7JXR8YKOL4laPmyTjcbo\"",
    "mtime": "2022-04-15T15:17:45.029Z",
    "path": "../public/index.html"
  },
  "/vitalcrm.html": {
    "type": "text/html; charset=utf-8",
    "etag": "\"567-4SaM8jG9lWDeT3ReB+JC+6CoKP0\"",
    "mtime": "2022-04-15T15:17:45.033Z",
    "path": "../public/vitalcrm.html"
  },
  "/_nuxt/default-f225b5e2.mjs": {
    "type": "application/javascript",
    "etag": "\"223-jWwKKN5JWhoddo7ZrwvLBI8jlAk\"",
    "mtime": "2022-04-15T15:17:43.406Z",
    "path": "../public/_nuxt/default-f225b5e2.mjs"
  },
  "/_nuxt/entry-4cd04b6a.mjs": {
    "type": "application/javascript",
    "etag": "\"1e0a9-iVyRzMwooQAXRaHHdsnC/ANlHd4\"",
    "mtime": "2022-04-15T15:17:43.406Z",
    "path": "../public/_nuxt/entry-4cd04b6a.mjs"
  },
  "/_nuxt/entry.2d55a0e6.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"1f13-XPfhO6Ja16J3/+kSLEu3f2mNpyE\"",
    "mtime": "2022-04-15T15:17:43.405Z",
    "path": "../public/_nuxt/entry.2d55a0e6.css"
  },
  "/_nuxt/index-3e02e6fc.mjs": {
    "type": "application/javascript",
    "etag": "\"e3-CTHsxlPAganlejjlPLmttPPmQ58\"",
    "mtime": "2022-04-15T15:17:43.405Z",
    "path": "../public/_nuxt/index-3e02e6fc.mjs"
  },
  "/_nuxt/index-662ea4cb.mjs": {
    "type": "application/javascript",
    "etag": "\"137-E8f15g4+8nk/JxMPOi+vfBOBwEA\"",
    "mtime": "2022-04-15T15:17:43.404Z",
    "path": "../public/_nuxt/index-662ea4cb.mjs"
  },
  "/_nuxt/manifest.json": {
    "type": "application/json",
    "etag": "\"396-ILQh3kb7rWtqyqcncy+Qpu15oek\"",
    "mtime": "2022-04-15T15:17:43.403Z",
    "path": "../public/_nuxt/manifest.json"
  }
};

const mainDir = dirname(fileURLToPath(globalThis.entryURL));
function readAsset (id) {
  return promises.readFile(resolve(mainDir, assets[id].path)).catch(() => {})
}

const publicAssetBases = ["/_nuxt"];

function isPublicAssetURL(id = '') {
  if (assets[id]) {
    return
  }
  for (const base of publicAssetBases) {
    if (id.startsWith(base)) { return true }
  }
  return false
}

function getAsset (id) {
  return assets[id]
}

const METHODS = ["HEAD", "GET"];
const _static = eventHandler(async (event) => {
  if (event.req.method && !METHODS.includes(event.req.method)) {
    return;
  }
  let id = decodeURIComponent(withLeadingSlash(withoutTrailingSlash(parseURL(event.req.url).pathname)));
  let asset;
  for (const _id of [id, id + "/index.html"]) {
    const _asset = getAsset(_id);
    if (_asset) {
      asset = _asset;
      id = _id;
      break;
    }
  }
  if (!asset) {
    if (isPublicAssetURL(id)) {
      throw createError({
        statusMessage: "Cannot find static asset " + id,
        statusCode: 404
      });
    }
    return;
  }
  const ifNotMatch = event.req.headers["if-none-match"] === asset.etag;
  if (ifNotMatch) {
    event.res.statusCode = 304;
    event.res.end("Not Modified (etag)");
    return;
  }
  const ifModifiedSinceH = event.req.headers["if-modified-since"];
  if (ifModifiedSinceH && asset.mtime) {
    if (new Date(ifModifiedSinceH) >= new Date(asset.mtime)) {
      event.res.statusCode = 304;
      event.res.end("Not Modified (mtime)");
      return;
    }
  }
  if (asset.type) {
    event.res.setHeader("Content-Type", asset.type);
  }
  if (asset.etag) {
    event.res.setHeader("ETag", asset.etag);
  }
  if (asset.mtime) {
    event.res.setHeader("Last-Modified", asset.mtime);
  }
  const contents = await readAsset(id);
  event.res.end(contents);
});

export { _static as default };
