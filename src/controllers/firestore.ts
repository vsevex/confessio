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
}

export default FirestoreController;
