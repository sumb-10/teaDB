import { cert, getApp, getApps, initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { readFileSync } from "fs";

const projectId = process.env.FIREBASE_PROJECT_ID!;
const keyPath = process.env.GOOGLE_APPLICATION_CREDENTIALS || "./scripts/serviceAccountKey.json";
const serviceAccount = JSON.parse(readFileSync(keyPath, "utf8"));

const app =
  getApps().length === 0
    ? initializeApp({ credential: cert(serviceAccount as any), projectId })
    : getApp();

export const adminDb = getFirestore(app);
