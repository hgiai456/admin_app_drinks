import admin from "firebase-admin";
import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import dotenv from "dotenv";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const serviceAccount = JSON.parse(
  readFileSync(join(__dirname, "./firebase-service-account.json"), "utf8"),
);

const storageBucket =
  process.env.FIREBASE_STORAGE_BUCKET || "hg-store-a11c5.appspot.com";

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL:
      "https://hg-store-a11c5-default-rtdb.asia-southeast1.firebasedatabase.app",
    storageBucket: storageBucket,
  });
}

const bucket = admin.storage().bucket();

export { admin, bucket };
