const environment = process.env;

const {
  BOT_TOKEN,
  BOT_USERNAME,
  NODE_ENV = "development",
} = environment as { [key: string]: string | undefined };

if (!BOT_TOKEN) {
  throw new Error("Provide telegram bot token in .env file");
}

const botInfo = {
  token: BOT_TOKEN,
  username: BOT_USERNAME,
};

const isDev = NODE_ENV === "development";
const isProd = NODE_ENV !== "development";

export default {
  isDev,
  isProd,
  botInfo,
  ...environment,
};
