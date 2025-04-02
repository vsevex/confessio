import FirestoreController from "../../controllers/firestore";
import TaskController from "../../controllers/task";
import di from "../../injection";
import { Confession } from "../../models/confession";
import { SessionContext } from "../../session";

export async function fetchMyConfessionsHandler(
  ctx: SessionContext
): Promise<Confession[] | undefined> {
  const firestore: FirestoreController = di().get<FirestoreController>(
    "firestoreController"
  );
  const user = await ctx.getChat();

  try {
    const confessions = await firestore.parseConfessions(user.id);

    return confessions;
  } catch (error) {
    // pass
  }
}

export async function deleteConfessionHandler(
  confessionId: string
): Promise<void> {
  const firestore: FirestoreController = di().get<FirestoreController>(
    "firestoreController"
  );
  const task: TaskController = di().get<TaskController>("taskController");

  try {
    await task.removeTask(confessionId);
    await firestore.deleteConfession(confessionId);
  } catch (error) {
    // pass
  }
}
