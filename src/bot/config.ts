const environment = process.env;

const {
  BOT_TOKEN,
  BOT_USERNAME,
  SENTRY_URL,
  BOT_DROP_PENDING_UPDATES,
  REDIS_HOST,
  REDIS_PORT,
  NODE_ENV = "development",
} = environment as { [key: string]: any | undefined };

if (!BOT_TOKEN) {
  throw new Error("Provide telegram bot token in .env file");
}

const botInfo = {
  token: BOT_TOKEN,
  username: BOT_USERNAME,
};

export default {
  NODE_ENV,
  botInfo,
  SENTRY_URL,
  REDIS_HOST,
  REDIS_PORT,
  BOT_DROP_PENDING_UPDATES,
  ...environment,
};
