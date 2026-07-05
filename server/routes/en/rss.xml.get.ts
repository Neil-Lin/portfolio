export default defineEventHandler((event) =>
  buildBlogRss(event, "blog_en", {
    pathPrefix: "/en",
    title: "Neil's Portfolio — Blog",
    description: "Notes on frontend, design, and accessibility.",
    language: "en",
  }),
);
