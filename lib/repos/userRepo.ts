import { db } from "../firebase.client";
import { doc, getDoc, setDoc } from "firebase/firestore";

export async function getUser(uid:string) {
  const snap = await getDoc(doc(db, "users", uid));
  return snap.exists() ? { uid, ...snap.data() } : null;
}

export async function upsertUser(u:{uid:string; displayName:string; email:string; role?:string}) {
  await setDoc(doc(db, "users", u.uid), {
    displayName: u.displayName, email: u.email, role: u.role ?? "guest"
  }, { merge: true });
}
