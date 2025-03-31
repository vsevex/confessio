import { md } from "@vlad-yakovlev/telegram-md";
import { Context } from "telegraf";

/**
 * Start command controller
 */
const startCommand = async (ctx: Context) => {
  const message = md`
${md.bold("🤫 Welcome to Confessio – Where Secrets Have a Price 🤫")}

🔹 Got a secret? A regret? A confession burning inside you?
🔹 Share it ${md.bold(
    "100% anonymously"
  )} – but beware, once it’s out, it’s out.
🔹 Need to erase your past? That’ll cost you.

${md.bold(
  "No names. No tracking. No judgment."
)} Just you, your sins, and the price to cleanse them.

Type ${md.inlineCode("/help")} for more details.  
`;

  return await ctx.replyWithMarkdownV2(md.build(message));
};

export default startCommand;
