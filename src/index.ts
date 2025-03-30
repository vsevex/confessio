import * as dotenv from "dotenv";

// Load environment variables from .env file
dotenv.config();

import { Context, Telegraf } from "telegraf";
import * as winston from "winston";

import config from "./bot/config";

import LogService from "./log";
import DiContainer from "./injection";
import SentryService from "./sentry";
import bot from "./bot";
import { Update } from "telegraf/types";

const di = DiContainer();

async function main() {
  di.register("config", config);
  di.register("logService", LogService("info", {}));
  di.register("sentryUrl", config.SENTRY_URL);
  di.register(
    "sentryService",
    new SentryService(config.SENTRY_URL!, {
      nodeEnv: config.NODE_ENV,
      sentryTracesSampleRate: "1.0",
    })
  );

  di.factory(
    "bot",
    async (logService, sentryService) =>
      await bot(
        {
          information: {
            token: config.botInfo.token,
            username: config.botInfo.username!,
          },
          botDropPendingUpdates: config.BOT_DROP_PENDING_UPDATES,
        },
        logService,
        sentryService
      )
  );

  di.get<Telegraf<Context<Update>>>("bot");
}

main();

const logger = di.get<winston.Logger>("logService");
const sentry = di.get<SentryService>("sentryService");

async function stopApplication(code?: number | undefined) {
  const bot = di.get<Telegraf<Context<Update>>>("bot");
  logger.info("Stopping application...");
  await Promise.allSettled([
    sentry.close().then(() => logger.info("Sentry closed")),
    bot.stop(),
    logger.info("Bot stopped"),
  ]);
  logger.info("Application stopped");
  process.exit(code);
}

async function processError(error: Error) {
  logger.error(error.stack);
  sentry.captureException(error);
  await stopApplication(1);
}

process
  .once("uncaughtException", processError)
  .once("unhandledRejection", processError)
  .once("SIGTERM", () => stopApplication())
  .once("SIGINT", () => stopApplication());
