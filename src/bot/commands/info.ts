import { Context } from "telegraf";
import { md } from "@vlad-yakovlev/telegram-md";

/**
 * Info command controller
 */
const infoCommand = async (ctx: Context) => {
  const message = md`
${md.bold(
  "This bot allows you to share anonymous confessions in a Telegram channel."
)}

${md.italic("📜 Rules:")}

1. You must pay ${md.bold("2 TON")} to submit a confession.
2. Once shared, your confession will be live for ${md.bold("30 minutes")}.
3. You can remove your confession within this period by paying ${md.bold(
    "10 TON"
  )}.
4. After ${md.bold(
    "5 days"
  )}, you can remove your confession for a reduced fee of ${md.bold("1 TON")}.
5. All confessions are shared only in the Telegram channel.

${md.italic("⚙️ Options:")}

- You can choose to share your confession ${md.bold(
    "anonymously"
  )} or with a ${md.bold("username")}.
- You can allow or disable ${md.bold(
    "comments"
  )} from other users in the channel.
`;

  return await ctx.replyWithMarkdownV2(md.build(message));
};

export default infoCommand;
