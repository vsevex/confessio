import { Scenes } from "telegraf";
import Context from "telegraf/typings/context";

export interface SessionData extends Scenes.SceneSession<MySceneSession> {
  awaitingConfession: boolean;
  confession?: string | null;
  [key: string]: any;
}

interface MySceneSession extends Scenes.SceneSessionData {
  // will be available under `ctx.scene.session.submissionSession`
  submissionSession: number;
}

export interface SessionContext extends Context {
  session?: SessionData;
  scene: Scenes.SceneContextScene<SessionContext, MySceneSession>;
}
