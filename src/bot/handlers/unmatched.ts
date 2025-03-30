import { Composer } from "telegraf";
import commands from "../commands";

export default Composer.on(
  "message",
  Composer.privateChat((ctx, next) => {
    const text = ctx.text;
    const handled = commands.myCommands.map((cmd) => `/${cmd.command}`);

    if (handled.includes(text ?? "")) {
      return next();
    }

    return ctx.reply("There was a misunderstanding, do you need /help?");
  })
);
