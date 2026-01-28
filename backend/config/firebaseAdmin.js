import admin from "firebase-admin";
import serviceAccount from "./firebase-service-account.json";

const storageBucket = process.env.FIREBASE_STORAGE_BUCKET;

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    storageBucket: storageBucket,
  });
}

const bucket = admin.storage().bucket();

export { admin, bucket };
