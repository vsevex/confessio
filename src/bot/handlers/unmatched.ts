import { Composer } from "telegraf";

export default Composer.on(
  "message",
  Composer.privateChat((ctx) =>
    ctx.reply("There was a misunderstanding, do you need /help?")
  )
);
