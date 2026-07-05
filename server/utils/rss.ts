import type { H3Event } from "h3";
import { queryCollection } from "@nuxt/content/server";

const escapeXml = (s: string) =>
  s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");

export async function buildBlogRss(
  event: H3Event,
  collection: "blog_zh" | "blog_en",
  opts: {
    pathPrefix: string;
    title: string;
    description: string;
    language: string;
  },
) {
  const config = useRuntimeConfig();
  const base = config.public.baseUrl as string;

  const docs = await queryCollection(event, collection)
    .where("draft", "=", false)
    .order("date", "DESC")
    .all();

  const latest = docs[0];
  const lastBuildDate = new Date(
    latest?.updatedAt ?? latest?.date ?? Date.now(),
  ).toUTCString();

  const feedUrl = `${base}${opts.pathPrefix}/rss.xml`;
  const items = docs
    .map((doc) => {
      const slug = doc.stem.split("/").pop();
      const link = `${base}${opts.pathPrefix}/blog/${slug}`;
      const pubDate = new Date(doc.updatedAt ?? doc.date).toUTCString();
      return `    <item>
      <title>${escapeXml(doc.title)}</title>
      <link>${link}</link>
      <guid>${link}</guid>
      <pubDate>${pubDate}</pubDate>
      <description>${escapeXml(doc.description)}</description>
    </item>`;
    })
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(opts.title)}</title>
    <link>${base}${opts.pathPrefix}/blog</link>
    <description>${escapeXml(opts.description)}</description>
    <language>${opts.language}</language>
    <lastBuildDate>${lastBuildDate}</lastBuildDate>
    <atom:link href="${feedUrl}" rel="self" type="application/rss+xml" />
${items}
  </channel>
</rss>`;

  event.node.res.setHeader(
    "content-type",
    "application/rss+xml; charset=utf-8",
  );
  return xml;
}
