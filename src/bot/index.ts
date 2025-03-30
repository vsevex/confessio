import { Context, Telegraf } from "telegraf";
import { Update } from "telegraf/typings/core/types/typegram";

import unmatchedHandler from "./handlers/unmatched";
import SentryService from "../sentry";

interface Config {
  information: {
    token: string;
    username: string;
  };
  botDropPendingUpdates?: boolean;
}

interface LogService {
  main: {
    info(message: string): void;
    error(message: string): void;
  };
}

export default async (
  config: Config,
  logService: LogService,
  sentryService: SentryService
): Promise<Telegraf> => {
  const bot = new Telegraf(config.information.token);

  bot.use(unmatchedHandler);

  await bot.telegram.deleteWebhook({
    drop_pending_updates: !!config.botDropPendingUpdates,
  });

  bot
    .launch()
    .then(() =>
      logService.main.info(`Bot "${config.information.username}" started`)
    )
    .catch((error: Error) => {
      logService.main.error(error.stack || "Unknown error");
    });

  bot.catch((err: unknown, ctx: Context<Update>) => {
    const error = err as Error; // cast the unknown error to Error type

    logService.main.error(error.stack || "Unknown error");
    sentryService.captureException(error);
  });

  return bot;
};
