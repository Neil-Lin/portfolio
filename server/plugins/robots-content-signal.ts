export default defineNitroPlugin((nitroApp) => {
  nitroApp.hooks.hook("robots:robots-txt", (ctx: { robotsTxt: string }) => {
    ctx.robotsTxt +=
      "\nContent-Signal: ai-train=no, search=yes, ai-input=yes\n";
  });
});
