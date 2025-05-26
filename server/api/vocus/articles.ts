import { defineEventHandler, setResponseHeader } from "h3";

export default defineEventHandler(async (event) => {
  const creatorId = "62c6eb99fd897800015d364c";
  const apiUrl = `https://api.vocus.cc/api/contents?creatorId=${creatorId}&isAllowedFetch=true&num=10&order=desc&page=1&sort=publishAt&status=2&type=`;

  try {
    const response = await fetch(apiUrl, {
      headers: { accept: "application/json" },
    });

    if (!response.ok) {
      throw new Error(`Vocus API 回傳錯誤：${response.status}`);
    }

    const json = await response.json();

    if (!json.contents || !Array.isArray(json.contents)) {
      throw new Error("回傳格式錯誤或內容為空");
    }

    const articles = json.contents.map((item: any) => ({
      id: item.article._id,
      title: item.article.title,
      abstract: item.article.abstract ?? "",
      link: `https://vocus.cc/article/${item.article._id}`,
    }));

    setResponseHeader(event, "Cache-Control", "public, max-age=300");
    return { articles };
  } catch (err: any) {
    console.error("[Vocus API Error]", err);
    event.node.res.statusCode = 500;
    return { error: err.message };
  }
});
