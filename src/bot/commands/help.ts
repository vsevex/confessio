import { Context } from "telegraf";
import { fmt } from "telegraf/format";

/**
 * Help command controller
 */
const helpCommand = async (ctx: Context) =>
  await ctx.reply(fmt`
Welcome to Confessio – the ultimate anonymous confession bot.

Share your secrets, cleanse your soul, or delete your past... for a price.

📝 Commands:
/info - Get information about the bot.
/submit – Submit an anonymous confession (requires payment).
/delete – Remove your confession(s) (requires payment).
/help – Show this help menu.

Need support? Contact: @Confessio
`);

export default helpCommand;
