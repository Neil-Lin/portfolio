export default defineSitemapEventHandler(async () => {
  // 動態引入產品資料
  const { default: productsData } = await import("~~/data/productsData");

  return productsData.map((product) => ({
    loc: `/products/${product.slug}`,
    lastmod: new Date().toISOString(),
    changefreq: "weekly",
    priority: 0.8,
    _i18nTransform: true,
  }));
});
