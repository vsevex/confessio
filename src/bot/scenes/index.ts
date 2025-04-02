import { Scenes } from "telegraf";

import scenes from "./submissionScene";
import { SessionContext } from "../../session";

export const stage = new Scenes.Stage<SessionContext>([...scenes], {
  ttl: 600,
});
