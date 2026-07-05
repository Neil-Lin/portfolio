import { queryCollection } from "@nuxt/content/server";
import type { Product } from "~~/data/types";

interface SitemapImage {
  loc: string;
  title: string;
  _i18n?: Record<string, { title: string }>;
}

interface SitemapVideo {
  title: string;
  description: string;
  thumbnail_loc: string;
  content_loc: string;
  _i18n?: Record<string, { title: string; description: string }>;
}

interface SitemapEntry {
  loc: string;
  lastmod?: string;
  _i18nTransform: boolean;
  images: SitemapImage[];
  videos: SitemapVideo[];
}

export default defineSitemapEventHandler(async (e) => {
  const { productsData }: { productsData: Product[] } =
    await import("~~/data/productsData");

  const clickableProducts = productsData.filter((p) => p.clickable);

  // lastmod 只在有真實內容更新依據時輸出（updatedAt）。
  // 不再用 build date 充數：每次部署都變動的 lastmod 會讓 Google 不信任這個欄位。
  const productUpdatedDates = clickableProducts
    .map((p) => p.updatedAt)
    .filter((d): d is string => Boolean(d))
    .sort();
  const productsLastmod = productUpdatedDates.at(-1);

  const staticRoutes: SitemapEntry[] = [
    "/",
    "/products",
    "/projects",
    "/blog",
    "/sitemap",
  ].map((loc) => ({
    loc,
    ...(loc === "/products" && productsLastmod
      ? { lastmod: new Date(productsLastmod).toISOString() }
      : {}),
    _i18nTransform: true,
    images: [],
    videos: [],
  }));

  const productRoutes = clickableProducts.map((p): SitemapEntry => {
    const images: SitemapImage[] = [];
    if (p.images?.["zh-Hant-TW"]) {
      p.images["zh-Hant-TW"].forEach((img, index) => {
        const entry: SitemapImage = { loc: img.src, title: img.figcaption };
        if (p.images?.en?.[index]) {
          entry._i18n = { en: { title: p.images.en[index]!.figcaption } };
        }
        images.push(entry);
      });
    }

    const videos: SitemapVideo[] = [];
    if (p.videos?.["zh-Hant-TW"]) {
      p.videos["zh-Hant-TW"].forEach((video, index) => {
        const entry: SitemapVideo = {
          title: video.title,
          description: video.description,
          thumbnail_loc: video.thumbnail_loc,
          content_loc: video.src,
        };
        if (p.videos?.en?.[index]) {
          entry._i18n = {
            en: {
              title: p.videos.en[index]!.title,
              description: p.videos.en[index]!.description,
            },
          };
        }
        videos.push(entry);
      });
    }

    return {
      loc: `/products/${p.slug}`,
      ...(p.updatedAt ? { lastmod: new Date(p.updatedAt).toISOString() } : {}),
      _i18nTransform: true,
      images,
      videos,
    };
  });

  // 部落格文章：模型 B（各語言獨立、可能單語言），逐篇直接輸出實際網址，
  // 不用 _i18nTransform（避免產生不存在的跨語言鏡像）。lastmod 用 frontmatter。
  const buildBlogRoutes = async (
    collection: "blog_zh" | "blog_en",
    prefix: string,
  ): Promise<SitemapEntry[]> => {
    const docs = await queryCollection(e, collection)
      .where("draft", "=", false)
      .all();
    return docs.map((doc): SitemapEntry => {
      const slug = doc.stem.split("/").pop();
      const lastmodSrc = doc.updatedAt ?? doc.date;
      return {
        loc: `${prefix}/${slug}`,
        ...(lastmodSrc ? { lastmod: new Date(lastmodSrc).toISOString() } : {}),
        _i18nTransform: false,
        images: [],
        videos: [],
      };
    });
  };

  const blogRoutes = [
    ...(await buildBlogRoutes("blog_zh", "/blog")),
    ...(await buildBlogRoutes("blog_en", "/en/blog")),
  ];

  return [...staticRoutes, ...productRoutes, ...blogRoutes];
});
