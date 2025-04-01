import FirestoreController from "../../controllers/firestore";
import di from "../../injection";
import * as winston from "winston";
import { SessionContext } from "../../session";

export default async function submissionHandler(
  ctx: SessionContext,
  text?: string | undefined | null,
  isAnonymous: boolean = false
) {
  const logger: winston.Logger = di().get<winston.Logger>("logger");
  const firestore: FirestoreController = di().get<FirestoreController>(
    "firestoreController"
  );
  const user = await ctx.getChat();

  try {
    const confessionId = await firestore.createConfession({
      user_id: user.id,
      text: text!,
      is_anonymous: isAnonymous,
      is_deleted: false,
      created_at: new Date(),
    });
    logger.info(`Confession submitted with ID: ${confessionId}`);
  } catch (error) {
    // pass
  }
}
