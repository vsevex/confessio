import {
  fetchMyConfessionsHandler,
  deleteConfessionHandler,
} from "../handlers/mysubmissions";
import submissionHandler from "../handlers/submission";
import { Markup, Scenes } from "telegraf";
import { SessionContext } from "../../session";
import { md } from "@vlad-yakovlev/telegram-md";

const { enter, leave } = Scenes.Stage;

const submissionScene = new Scenes.BaseScene<SessionContext>("submission");

submissionScene.enter((ctx) => {
  if (ctx.session?.youHavePendingConfession) {
    return ctx.replyWithMarkdownV2(
      md.build(md`
You have a pending confession:

${md.spoiler(ctx.session.confession)}

You can:
      `),
      {
        ...Markup.inlineKeyboard([
          Markup.button.callback("Edit", "edit"),
          Markup.button.callback("Submit", "submit"),
        ]),
      }
    );
  }

  return ctx.reply("Please send your confession", {
    ...Markup.inlineKeyboard([
      Markup.button.callback(
        "Cancel",
        "cancel",
        ctx.session?.confession !== null
      ),
    ]),
  });
});
submissionScene.leave((ctx) => {
  if (ctx.session?.__scenes?.pendingConfirmation) {
    return ctx.replyWithMarkdownV2(
      md.build(md`
        📝 ${md.italic("You have a pending confession.")}  
        You can:
        `),
      {
        ...Markup.inlineKeyboard([
          Markup.button.callback("Edit", "edit"),
          Markup.button.callback("Submit", "submit"),
        ]),
      }
    );
  } else if (!ctx.session?.confession) {
    return ctx.reply("🔹 Submit again anytime with /submit.");
  }
});
submissionScene.action("cancel", leave<SessionContext>());
submissionScene.action("edit", async (ctx) => {
  ctx.session!.__scenes = {
    pendingConfirmation: false,
    publishedConfession: false,
  };
  ctx.session!.youHavePendingConfession = false;

  return enter<SessionContext>("submission")(ctx);
});
submissionScene.action("submit", enter<SessionContext>("visibility"));
submissionScene.on("message", (ctx) => {
  const text = ctx.text;
  if ((text?.length ?? 0) < 100) {
    return ctx.reply(
      "Your confession is too short, make it at least 100 characters long."
    );
  }

  if (ctx.session) {
    ctx.session.confession = text;
  }
  return enter<SessionContext>("visibility")(ctx);
});

const visibilityScene = new Scenes.BaseScene<SessionContext>("visibility");

visibilityScene.enter((ctx) => {
  ctx.replyWithMarkdownV2(
    md.build(md`
📢 ${md.bold("How do you want to publish your confession?")}
🔹 ${md.bold("Anonymously")} – No name, just your words.
🔹 ${md.bold("Publicly")} – Your username will be shown.
    `),
    {
      ...Markup.inlineKeyboard([
        Markup.button.callback("Anonymous", "anonymous"),
        Markup.button.callback("Public", "public"),
      ]),
    }
  );
});

visibilityScene.action("anonymous", (ctx) => {
  ctx.session!.confessionVisibility = "anonymous";

  return enter<SessionContext>("confirmation")(ctx);
});

visibilityScene.action("public", (ctx) => {
  ctx.session!.confessionVisibility = "public";

  return enter<SessionContext>("confirmation")(ctx);
});

const confirmationScene = new Scenes.BaseScene<SessionContext>("confirmation");

confirmationScene.enter((ctx) => {
  ctx.session!.__scenes!.pendingConfirmation = true;
  ctx.session!.youHavePendingConfession = true;

  ctx.replyWithMarkdownV2(
    md.build(md`
Please confirm your confession:

${md.spoiler(ctx.session?.confession)}
    `),
    {
      ...Markup.inlineKeyboard([
        Markup.button.callback("Confirm", "confirm"),
        Markup.button.callback("Edit", "edit"),
      ]),
    }
  );
});
confirmationScene.action("confirm", (ctx) => {
  ctx.session!.__scenes!.pendingConfirmation = false;
  ctx.session!.__scenes!.publishedConfession = true;
  ctx.session!.youHavePendingConfession = false;
  return leave<SessionContext>()(ctx);
});

confirmationScene.action("edit", async (ctx) => {
  ctx.session!.youHavePendingConfession = false;

  return enter<SessionContext>("submission")(ctx);
});

confirmationScene.leave(async (ctx) => {
  if (ctx.session?.__scenes?.publishedConfession) {
    const confession = ctx.session?.confession;
    await submissionHandler(
      ctx,
      confession,
      ctx.session?.confessionVisibility === "anonymous"
    );
    ctx.session!.confession = null;

    return ctx.replyWithMarkdownV2(
      md.build(md`
✅ ${md.italic("Confession Submitted!")}
Your confession will be published in ${md.bold("30 minutes")}.
      `)
    );
  }
});

const mySubmissionsScene = new Scenes.BaseScene<SessionContext>(
  "my_submissions"
);

mySubmissionsScene.enter(async (ctx) => {
  const confessions = await fetchMyConfessionsHandler(ctx);

  const confessionButtons = confessions?.map((confession, index) => {
    mySubmissionsScene.action(`confession_${index + 1}`, (ctx) =>
      ctx.reply(
        confession.text,
        confession.is_published
          ? undefined
          : Markup.inlineKeyboard([
              Markup.button.callback("Cancel publish", `cancel`),
            ])
      )
    );

    mySubmissionsScene.action("cancel", async (ctx) => {
      await deleteConfessionHandler(confession.ref_id!);

      return ctx.reply("✅ Confession cancelled successfully!");
    });

    return Markup.button.callback(confession.text, `confession_${index + 1}`);
  });

  return ctx.replyWithMarkdownV2(
    md.build(
      confessions?.length === 0
        ? md`
📭 ${md.bold("No confessions found!")}
          `
        : md`
Your confessions:
          `
    ),
    Markup.inlineKeyboard(confessionButtons ?? [], { columns: 1 })
  );
});

export default [
  submissionScene,
  visibilityScene,
  confirmationScene,
  mySubmissionsScene,
];
