import * as dotenv from "dotenv";

// Load environment variables from .env file
dotenv.config();

import * as winston from "winston";

import config from "./bot/config";

import LogService from "./log";
import DiContainer from "./injection";
import SentryService from "./sentry";
import BotService from "./bot";
import FirestoreController from "./controllers/firestore";

var logger: winston.Logger;
var sentry: SentryService;
var bot: BotService;

const di = DiContainer();

async function main(): Promise<void> {
  di.register("config", config);
  logger = LogService("info", { isDev: config.NODE_ENV === "development" });
  di.register("logger", logger);
  di.register("sentryUrl", config.SENTRY_URL);
  di.register("firestoreController", new FirestoreController(logger));
  sentry = new SentryService(config.SENTRY_URL!, {
    nodeEnv: config.NODE_ENV,
    sentryTracesSampleRate: "1.0",
  });
  di.register("sentryService", sentry);

  bot = new BotService(
    {
      information: {
        token: config.botInfo.token,
        username: config.botInfo.username!,
      },
      redis: {
        host: config.REDIS_HOST,
        port: config.REDIS_PORT,
      },
      botDropPendingUpdates: config.BOT_DROP_PENDING_UPDATES,
    },
    logger,
    sentry
  );

  di.register("bot", bot);

  await bot.init();
}

main();

async function stopApplication(code?: number | undefined) {
  logger.info("Stopping application...");

  await sentry.close();
  logger.info("Sentry closed");

  di.get<BotService>("bot").stop();
  logger.warn("Bot stopped");

  logger.warn("Application stopped");
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
