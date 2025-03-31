import commands from "../commands";
import { SessionContext } from "../../session";

export default function unmatchedHandler(
  ctx: SessionContext,
  next: () => Promise<void>
) {
  const text = ctx.text;
  const handled = commands.myCommands.map((cmd) => `/${cmd.command}`);
  handled.push("/start");

  if (handled.includes(text ?? "")) {
    return next();
  }

  return ctx.reply("There was a misunderstanding, do you need /help?");
}
