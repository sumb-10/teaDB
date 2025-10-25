import { db } from "../firebase.client";
import { doc, getDoc } from "firebase/firestore";

export async function getPublicStats(name: string, year: number) {
  const id = `${name}-${year}`.toLowerCase().replace(/\s+/g,"-");
  const snap = await getDoc(doc(db, "publicStats", id));
  return snap.exists() ? snap.data() : null;
}
