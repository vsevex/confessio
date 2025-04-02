import { initialize, db } from "./config";
import { Confession } from "../models/confession";
import { v4 as uuidv4 } from "uuid";

import * as winston from "winston";

class FirestoreController {
  private logger: winston.Logger;

  constructor(logger: winston.Logger) {
    this.logger = logger;
    logger.warn("Firebase Firestore initialized");
    initialize();
  }

  async createConfession(data: Confession): Promise<string> {
    try {
      const confessionId = uuidv4();
      const docRef = await db.collection("confessions").add({
        ...data,
        id: confessionId,
      });
      this.logger.info(
        "Confession created with document ID: ",
        docRef.id,
        " and confession ID: ",
        confessionId
      );
      return docRef.id;
    } catch (error) {
      this.logger.error("Error creating confession:", error);
      throw error;
    }
  }

  async parseConfessions(userId: number): Promise<Confession[]> {
    try {
      const snapshot = await db
        .collection("confessions")
        .where("user_id", "==", userId)
        .where("is_deleted", "==", false)
        .get();
      const confessions: Confession[] = snapshot.docs.map((doc) => {
        return {
          ref_id: doc.id,
          order_id: doc.data().order_id,
          id: doc.data().id,
          user_id: userId,
          text: doc.data().text,
          is_published: doc.data().is_published,
          is_anonymous: doc.data().is_anonymous,
          is_deleted: doc.data().is_deleted,
          created_at: doc.data().created_at.toDate(),
        };
      });

      return confessions;
    } catch (error) {
      this.logger.error(
        "Error while parsing confessions for user: ",
        userId,
        error
      );
      throw error;
    }
  }

  async deleteConfession(id: string): Promise<void> {
    try {
      const confessionRef = db.collection("confessions").doc(id);
      await confessionRef.update({ is_deleted: true });
      this.logger.info("Confession deleted with ID: ", id);
    } catch (error) {
      this.logger.error("Error deleting confession:", error);
      throw error;
    }
  }

  async publishConfession(id: string): Promise<void> {
    try {
      console.log(id);
      const confessionRef = db.collection("confessions").doc(id);
      await confessionRef.update({ is_published: true });
      this.logger.info("Confession published with ID: ", id);
    } catch (error) {
      console.log(error);
      this.logger.error("Error publishing confession with ID: ", id, error);
    }
  }
}

export default FirestoreController;
