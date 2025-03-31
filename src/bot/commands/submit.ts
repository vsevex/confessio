import { Scenes } from "telegraf";
import { SessionContext } from "../../session";

const submissionScene = new Scenes.BaseScene<SessionContext>(
  "SUBMISSION_SCENE"
);

submissionScene.enter((ctx) => {
  if (ctx.session) {
    ctx.session.awaitingConfession = true;
  }

  return ctx.reply("Please enter your confession:");
});

submissionScene.leave((ctx) =>
  ctx.reply("If you want to submit another confession, type /submit")
);

submissionScene.on("message", (ctx) => {
  console.log(ctx.session?.awaitingConfession);
});

export default submissionScene;
