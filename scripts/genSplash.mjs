// 一次性產生 iOS 起始畫面（apple-touch-startup-image）。
// 用專案既有的 @resvg/resvg-js（零新依賴）：網站底色 + 置中大頭照。
// 執行：node scripts/genSplash.mjs
import { Resvg } from "@resvg/resvg-js";
import { readFileSync, writeFileSync, mkdirSync, readdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const outDir = join(root, "public/images");
mkdirSync(outDir, { recursive: true });

const BG = "#fafafa"; // 網站背景色（--wrapper-bg ≈ oklch(98.51% 0 0)）

// 大頭照（高解析版）轉 base64 內嵌
const avatarB64 = readFileSync(join(root, "public/favicon-512.png")).toString(
  "base64",
);
const avatar = `data:image/png;base64,${avatarB64}`;

// 對齊參考做法的 30 個裝置尺寸
const sizes = [
  "1125x2436",
  "1170x2532",
  "1179x2556",
  "1242x2208",
  "1242x2688",
  "1284x2778",
  "1290x2796",
  "1334x750",
  "1536x2048",
  "1620x2160",
  "1640x2360",
  "1668x2224",
  "1668x2388",
  "1792x828",
  "2048x1536",
  "2048x2732",
  "2160x1620",
  "2208x1242",
  "2224x1668",
  "2360x1640",
  "2388x1668",
  "2436x1125",
  "2532x1170",
  "2556x1179",
  "2688x1242",
  "2732x2048",
  "2778x1284",
  "2796x1290",
  "750x1334",
  "828x1792",
];

for (const size of sizes) {
  const [W, H] = size.split("x").map(Number);
  const box = Math.round(Math.min(W, H) * 0.4); // 大頭照顯示尺寸
  const x = Math.round((W - box) / 2);
  const y = Math.round((H - box) / 2);
  const svg = `<svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg">
  <rect width="${W}" height="${H}" fill="${BG}"/>
  <image x="${x}" y="${y}" width="${box}" height="${box}" href="${avatar}"/>
</svg>`;
  const png = new Resvg(svg, { fitTo: { mode: "width", value: W } })
    .render()
    .asPng();
  writeFileSync(join(outDir, `apple-splash-${size}.png`), png);
}

const made = readdirSync(outDir).filter((f) => f.startsWith("apple-splash-"));
console.log(`✓ 產生 ${made.length} 張 apple-splash 圖（大頭照 + #fafafa 底）`);
