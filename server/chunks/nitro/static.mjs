import { eventHandler, createError } from 'h3';
import { withLeadingSlash, withoutTrailingSlash, parseURL } from 'ufo';
import { promises } from 'fs';
import { resolve, dirname } from 'pathe';
import { fileURLToPath } from 'url';

const assets = {
  "/index.html": {
    "type": "text/html; charset=utf-8",
    "etag": "\"549-bIrR0HzWxAN/Hy8WhuJqmV5ycAY\"",
    "mtime": "2022-04-15T14:31:13.541Z",
    "path": "../public/index.html"
  },
  "/vitalcrm.html": {
    "type": "text/html; charset=utf-8",
    "etag": "\"567-4mDTreDpna+Rl7s72IwcjPsJHdk\"",
    "mtime": "2022-04-15T14:31:13.546Z",
    "path": "../public/vitalcrm.html"
  },
  "/_nuxt/default-4f7a0ca2.mjs": {
    "type": "application/javascript",
    "etag": "\"223-tzGB/fwkx4YQdmYTd9EbbZzB8p0\"",
    "mtime": "2022-04-15T14:31:11.853Z",
    "path": "../public/_nuxt/default-4f7a0ca2.mjs"
  },
  "/_nuxt/entry-26e86989.mjs": {
    "type": "application/javascript",
    "etag": "\"1e0cb-BXUfH31gmnghjIvzhnqQM9rJ0qo\"",
    "mtime": "2022-04-15T14:31:11.852Z",
    "path": "../public/_nuxt/entry-26e86989.mjs"
  },
  "/_nuxt/entry.2d55a0e6.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"1f13-XPfhO6Ja16J3/+kSLEu3f2mNpyE\"",
    "mtime": "2022-04-15T14:31:11.852Z",
    "path": "../public/_nuxt/entry.2d55a0e6.css"
  },
  "/_nuxt/index-647b2f61.mjs": {
    "type": "application/javascript",
    "etag": "\"137-s66o44gi0lXmbOfZ7p55ZGu8b+4\"",
    "mtime": "2022-04-15T14:31:11.851Z",
    "path": "../public/_nuxt/index-647b2f61.mjs"
  },
  "/_nuxt/index-9a598ba9.mjs": {
    "type": "application/javascript",
    "etag": "\"e3-rw9khzINzNfDLIAb3zTs0A0mkvQ\"",
    "mtime": "2022-04-15T14:31:11.851Z",
    "path": "../public/_nuxt/index-9a598ba9.mjs"
  },
  "/_nuxt/manifest.json": {
    "type": "application/json",
    "etag": "\"396-SIp29Gf8WjfhHFsWbpxwuh+IwrM\"",
    "mtime": "2022-04-15T14:31:11.850Z",
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
