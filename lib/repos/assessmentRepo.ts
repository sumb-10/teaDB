import { db } from "../firebase.client";
import { collection, getDocs, query, where, orderBy, limit } from "firebase/firestore";
import { avgAndStd } from "../stats";

const col = () => collection(db, "assessments");

export type ScoreKeys =
  "thickness"|"density"|"softness"|"clarity"|"granularity"|
  "aromaContinuity"|"aromaLength"|"refinement"|"delicacy"|"afterAroma";

export async function listAssessments(filters: {
  teaId?: string; userId?: string; year?: number; pageSize?: number;
}) {
  const conds:any[] = [];
  if (filters.teaId) conds.push(where("teaId","==",filters.teaId));
  if (filters.userId) conds.push(where("userId","==",filters.userId));
  if (filters.year != null)  conds.push(where("year","==",filters.year)); // 저장 시 year 필드 추가 시 활용
  const q = query(col(), ...conds, orderBy("tastingDate","desc"), limit(filters.pageSize ?? 20));
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}

export async function statsByNameYear(name:string, year:number) {
  const q = query(col(), where("name","==",name), where("year","==",year), limit(500));
  const snap = await getDocs(q);
  const rows = snap.docs.map(d => d.data() as Record<string, number>);
  const scoreRows = rows.map(r => ({
    thickness:r.thickness, density:r.density, softness:r.softness, clarity:r.clarity, granularity:r.granularity,
    aromaContinuity:r.aromaContinuity, aromaLength:r.aromaLength, refinement:r.refinement, delicacy:r.delicacy, afterAroma:r.afterAroma
  }));
  const stats = scoreRows.length ? avgAndStd(scoreRows) : null;
  return { n: scoreRows.length, stats };
}
