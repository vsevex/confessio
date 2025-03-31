import { Context } from "telegraf";
import { fmt } from "telegraf/format";

/**
 * Help command controller
 */
const helpCommand = async (ctx: Context) =>
  await ctx.reply(fmt`
📝 Commands:
/info - Get information about the bot.
/submit – Submit an anonymous confession (requires payment).
/delete – Remove your confession(s) (requires payment).
/help – Show this help menu.

Need support? Contact: @Confessio
`);

export default helpCommand;
