import { session, Telegraf } from "telegraf";
import { Redis } from "@telegraf/session/redis";

import SentryService from "../sentry";
import commands from "./commands";
import { SessionContext, SessionData } from "../session";
import { stage } from "./scenes";

interface Config {
  information: {
    token: string;
    username: string;
  };
  redis: {
    host: string;
    port: number;
  };
  botDropPendingUpdates?: boolean;
}

interface LogService {
  info(message: string): void;
  error(message: string): void;
}

class BotService {
  private bot: Telegraf<SessionContext>;

  constructor(
    private config: Config,
    private logService: LogService,
    private sentryService: SentryService
  ) {
    this.bot = new Telegraf<SessionContext>(config.information.token);
  }

  /**
   * Initialize and start the bot
   */
  async init(): Promise<Telegraf<SessionContext>> {
    const store = Redis<SessionData>({
      url: `redis://${this.config.redis.host}:${this.config.redis.port}`,
    });

    const sess = session({
      store,
    });

    this.bot.use((ctx, next) => {
      ctx.session ??= {
        confession: null,
        youHavePendingConfession: false,
        confessionVisibility: "anonymous",
      };
      ctx.session.__scenes = {
        publishedConfession: false,
        pendingConfirmation: false,
      };
      return next();
    });
    this.bot.use(sess, stage.middleware());
    this.bot.start(commands.startCommand);

    this.bot.hears(commands.helpRegex, commands.helpCommand);
    this.bot.command(commands.helpRegex, commands.helpCommand);
    this.bot.action(commands.helpRegex, commands.helpCommand);

    this.bot.hears(commands.infoRegex, commands.infoCommand);
    this.bot.command(commands.infoRegex, commands.infoCommand);
    this.bot.action(commands.infoRegex, commands.infoCommand);

    this.bot.telegram.setMyCommands(commands.myCommands);

    this.bot.command(commands.submitRegex, (ctx) =>
      ctx.scene.enter("submission")
    );

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
