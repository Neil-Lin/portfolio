// 將線上 sitemap 內的所有 URL 推送給 IndexNow（Bing / Yandex 等會即時收到）。
// Google 官方不採用 IndexNow，但能讓內容在 Bing 等引擎快速被收錄。
// 執行：node scripts/indexnow.mjs
const HOST = "neillin.com";
const KEY = "f0c3fd55914c4ba9b6021d25692e138a";
const KEY_LOCATION = `https://${HOST}/${KEY}.txt`;
const SITEMAP_INDEX = `https://${HOST}/sitemap_index.xml`;

const locs = (xml) =>
  [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);

const fetchText = async (url) => {
  const r = await fetch(url);
  if (!r.ok) throw new Error(`${url} → ${r.status}`);
  return r.text();
};

// sitemap_index → 子 sitemap → 所有頁面 URL
const indexXml = await fetchText(SITEMAP_INDEX);
const childSitemaps = locs(indexXml);
const urlSet = new Set();
for (const sm of childSitemaps) {
  for (const u of locs(await fetchText(sm))) urlSet.add(u);
}
const urlList = [...urlSet];
console.log(`收集到 ${urlList.length} 個 URL，推送中…`);

const res = await fetch("https://api.indexnow.org/indexnow", {
  method: "POST",
  headers: { "Content-Type": "application/json; charset=utf-8" },
  body: JSON.stringify({
    host: HOST,
    key: KEY,
    keyLocation: KEY_LOCATION,
    urlList,
  }),
});

console.log(`IndexNow 回應：${res.status} ${res.statusText}`);
// 200 / 202 = 成功接收
if (![200, 202].includes(res.status)) {
  console.error(await res.text());
  process.exit(1);
}
console.log("✓ 已提交。Bing 等引擎將陸續處理。");
