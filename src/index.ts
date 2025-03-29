import { Telegraf } from "telegraf";
import * as dotenv from "dotenv";

function main() {
  // Load environment variables from .env file
  dotenv.config();

  const bot = new Telegraf(process.env.BOT_TOKEN!);

  bot.launch();

  // Enable graceful stop
  process.once("SIGINT", () => bot.stop("SIGINT"));
  process.once("SIGTERM", () => bot.stop("SIGTERM"));
}

main();
