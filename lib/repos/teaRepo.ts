import { db } from "../firebase.client";
import { collection, doc, getDoc, getDocs, query, where, orderBy, limit } from "firebase/firestore";

const col = () => collection(db, "tea");

export async function searchByNameYear(name: string, year?: number) {
  const conds: any[] = [ where("name", "==", name) ];
  if (year != null) conds.push(where("year","==",year));
  const q = query(col(), ...conds, orderBy("name"), limit(50));
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}

export async function getTeaById(id: string) {
  const ref = doc(db, "tea", id);
  const snap = await getDoc(ref);
  return snap.exists() ? { id, ...snap.data() } : null;
}
