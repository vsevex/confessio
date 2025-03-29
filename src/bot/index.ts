import { Telegraf } from "telegraf";

interface Config {
  information: {
    token: string;
    username: string;
  };
  botDropPendingUpdates?: boolean;
}

interface SentryService {}

interface LoggerService {
  main: {
    info(message: string): void;
    error(message: string): void;
  };
}

export default async (
  config: Config,
  loggerService: LoggerService,
  sentryService: SentryService
): Promise<Telegraf> => {
  const bot = new Telegraf(config.information.token);

  await bot.telegram.deleteWebhook({
    drop_pending_updates: !!config.botDropPendingUpdates,
  });

  bot
    .launch()
    .then(() =>
      loggerService.main.info(`Bot "${config.information.username}" started`)
    )
    .catch((error: Error) => {
      loggerService.main.error(error.stack || "Unknown error");
    });

  return bot;
};
