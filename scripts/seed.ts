import { adminDb } from "../lib/firebase.admin";
import { readFileSync } from "fs";
import { Timestamp } from "firebase-admin/firestore";

type Tea = { id:string; name:string; category:string; year:number; origin?:string; purchaseSource?:string; };
type User = { uid:string; displayName:string; email:string; role:"admin"|"panel"|"guest"; };
type Assessment = {
  id:string; teaId:string; userId:string; tastingDate:string;
  thickness:number; density:number; softness:number; clarity:number; granularity:number;
  aromaContinuity:number; aromaLength:number; refinement:number; delicacy:number; afterAroma:number;
  notes?:string; aromaTags?:string[];
};

async function seed() {
  const tea:Tea[] = JSON.parse(readFileSync("./seed/tea.json","utf8"));
  const users:User[] = JSON.parse(readFileSync("./seed/users.json","utf8"));
  const assessments:Assessment[] = JSON.parse(readFileSync("./seed/assessments.json","utf8"));

  for (const t of tea) {
    await adminDb.collection("tea").doc(t.id).set({ ...t, createdAt: Timestamp.now(), updatedAt: Timestamp.now() }, { merge: true });
    console.log("Upsert tea:", t.id);
  }
  for (const u of users) {
    await adminDb.collection("users").doc(u.uid).set({ ...u, joinedAt: Timestamp.now(), lastLogin: Timestamp.now() }, { merge: true });
    console.log("Upsert user:", u.uid);
  }
  for (const a of assessments) {
    await adminDb.collection("assessments").doc(a.id).set({
      ...a, tastingDate: Timestamp.fromDate(new Date(a.tastingDate)), createdAt: Timestamp.now(), updatedAt: Timestamp.now()
    }, { merge: true });
    console.log("Upsert assessment:", a.id);
  }
  console.log("✅ Seeding complete.");
}
seed().then(()=>process.exit(0)).catch(e=>{ console.error(e); process.exit(1); });
