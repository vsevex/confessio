import { Context, Middleware } from "telegraf";
import { Update } from "telegraf/types";

/**
 * Help command controller
 */
const helpCommand: Middleware<Context> = (ctx: Context<Update>) =>
  ctx.reply("Help");

export default { helpCommand };
