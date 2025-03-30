import { Telegraf } from "telegraf";

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
  info(message: string): void;
  error(message: string): void;
}

class BotService {
  private bot: Telegraf;

  constructor(
    private config: Config,
    private logService: LogService,
    private sentryService: SentryService
  ) {
    this.bot = new Telegraf(config.information.token);
  }

  /**
   * Initialize and start the bot
   */
  async init(): Promise<Telegraf> {
    this.bot.use(unmatchedHandler);

    await this.bot.telegram.deleteWebhook({
      drop_pending_updates: !!this.config.botDropPendingUpdates,
    });

    await this.bot
      .launch(() =>
        this.logService.info(
          `Bot "${this.config.information.username}" started`
        )
      )
      .catch((error: Error) => {
        this.logService.error(error.stack || "Unknown error");
      });

    this.bot.catch((err: unknown) => {
      const error = err as Error;
      this.logService.error(error.stack || "Unknown error");
      this.sentryService.captureException(error);
    });

    return this.bot;
  }

  stop(): void {
    this.bot.stop();
  }
}

export default BotService;
