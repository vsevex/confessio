import { Scenes } from "telegraf";
import Context from "telegraf/typings/context";

export interface SessionData extends Scenes.SceneSession<MySceneSession> {
  confession?: string | null;
  youHavePendingConfession: boolean;
  confessionVisibility: string;
}

interface MySceneSession extends Scenes.SceneSessionData {
  pendingConfirmation: boolean;
  publishedConfession: boolean;
}

export interface SessionContext extends Context {
  session?: SessionData;
  scene: Scenes.SceneContextScene<SessionContext, MySceneSession>;
}
