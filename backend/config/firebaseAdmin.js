import admin from "firebase-admin";
import dotenv from "dotenv";

dotenv.config();

const storageBucket =
  process.env.FIREBASE_STORAGE_BUCKET || "hg-store-a11c5.appspot.com";

console.log("🔥 Initializing Firebase Admin...");
console.log("📦 Storage Bucket:", storageBucket);
console.log("🌍 Environment:", process.env.NODE_ENV || "development");

if (!admin.apps.length) {
  // Kiểm tra xem có dùng file JSON không (dành cho development)
  const useServiceAccountFile = process.env.USE_SERVICE_ACCOUNT_FILE === "true";

  if (useServiceAccountFile) {
    // ===== DEVELOPMENT MODE: Dùng file JSON =====
    console.log("📄 Using service account file...");
    try {
      const { readFileSync } = await import("fs");
      const { fileURLToPath } = await import("url");
      const { dirname, join } = await import("path");

      const __filename = fileURLToPath(import.meta.url);
      const __dirname = dirname(__filename);

      const serviceAccount = JSON.parse(
        readFileSync(
          join(__dirname, "./firebase-service-account.json"),
          "utf8",
        ),
      );

      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        databaseURL:
          "https://hg-store-a11c5-default-rtdb.asia-southeast1.firebasedatabase.app",
        storageBucket: storageBucket,
      });

      console.log("Firebase Admin initialized with service account file");
    } catch (error) {
      console.error("Error loading service account file:", error.message);
      throw error;
    }
  } else {
    // ===== PRODUCTION MODE: Dùng biến môi trường =====
    console.log("Using environment variables...");

    // Kiểm tra các biến môi trường cần thiết
    const requiredEnvVars = {
      FIREBASE_PROJECT_ID: process.env.FIREBASE_PROJECT_ID,
      FIREBASE_CLIENT_EMAIL: process.env.FIREBASE_CLIENT_EMAIL,
      FIREBASE_PRIVATE_KEY: process.env.FIREBASE_PRIVATE_KEY,
    };

    // Log để debug (không hiện private key đầy đủ)
    console.log("🔍 Checking environment variables:");
    console.log(
      "  - FIREBASE_PROJECT_ID:",
      requiredEnvVars.FIREBASE_PROJECT_ID || "MISSING",
    );
    console.log(
      "  - FIREBASE_CLIENT_EMAIL:",
      requiredEnvVars.FIREBASE_CLIENT_EMAIL || "MISSING",
    );
    console.log(
      "  - FIREBASE_PRIVATE_KEY:",
      requiredEnvVars.FIREBASE_PRIVATE_KEY ? "EXISTS" : "MISSING",
    );

    // Kiểm tra xem có thiếu biến nào không
    const missingVars = Object.entries(requiredEnvVars)
      .filter(([key, value]) => !value)
      .map(([key]) => key);

    if (missingVars.length > 0) {
      throw new Error(
        ` Missing required environment variables: ${missingVars.join(", ")}`,
      );
    }

    // Khởi tạo Firebase Admin
    try {
      admin.initializeApp({
        credential: admin.credential.cert({
          projectId: process.env.FIREBASE_PROJECT_ID,
          clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
          privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n"),
        }),
        databaseURL:
          "https://hg-store-a11c5-default-rtdb.asia-southeast1.firebasedatabase.app",
        storageBucket: storageBucket,
      });

      console.log("Firebase Admin initialized with environment variables");
    } catch (error) {
      console.error("Error initializing Firebase Admin:", error.message);
      throw error;
    }
  }
}

const bucket = admin.storage().bucket();

export { admin, bucket };
