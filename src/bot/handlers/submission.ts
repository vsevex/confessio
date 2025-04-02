import FirestoreController from "../../controllers/firestore";
import di from "../../injection";
import * as winston from "winston";
import { SessionContext } from "../../session";
import TaskController from "../../controllers/task";

export default async function submissionHandler(
  ctx: SessionContext,
  text?: string | undefined | null,
  isAnonymous: boolean = false
) {
  const logger: winston.Logger = di().get<winston.Logger>("logger");
  const firestore: FirestoreController = di().get<FirestoreController>(
    "firestoreController"
  );
  const task: TaskController = di().get<TaskController>("taskController");
  const user = await ctx.getChat();

  try {
    const confessionId = await firestore.createConfession({
      ref_id: undefined,
      user_id: user.id,
      text: text!,
      is_published: false,
      is_anonymous: isAnonymous,
      is_deleted: false,
      created_at: new Date(),
    });

    await task.addTask(user.id, confessionId);

    logger.info(`Confession submitted with ID: ${confessionId}`);
  } catch (error) {
    // pass
  }
}
