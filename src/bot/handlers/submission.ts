import { WizardScene } from "telegraf/typings/scenes";
import { SessionContext } from "../../session";

const unwrapCallback = async (
  ctx: SessionContext,
  nextScene: (ctx: SessionContext) => Promise<string>
) => {
  const nextSceneId = await Promise.resolve(nextScene(ctx));
  if (nextSceneId) return ctx.scene.enter(nextSceneId, ctx.scene.state);
  return ctx.scene.leave();
};

type StepFunction = (
  ctx: SessionContext,
  next: (ctx: SessionContext) => Promise<string>
) => Promise<any> | void;

export const composeWizardScene = (...advancedSteps: StepFunction[]) =>
  function createWizardScene(
    sceneType: string,
    nextScene: (ctx: SessionContext) => Promise<string | undefined>
  ) {};
