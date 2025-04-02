import { initializeApp, cert } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

const serviceAccount = require("../../confessiotg.json");

var db: FirebaseFirestore.Firestore;

function initialize() {
  initializeApp({
    credential: cert(serviceAccount),
  });

  db = getFirestore();
  db.settings({ ignoreUndefinedProperties: true });
}

export { initialize, db };
