export type NumberDict = Record<string, number>;
export function mean(arr: number[]) { return arr.length ? arr.reduce((a,b)=>a+b,0)/arr.length : 0; }
export function stddev(arr: number[]) {
  if (arr.length < 2) return 0;
  const m = mean(arr);
  const v = mean(arr.map(x => (x-m)**2));
  return Math.sqrt(v);
}
export function avgAndStd(objArr: Record<string, number>[]) {
  const keys = Object.keys(objArr[0] || {});
  const result: Record<string, {avg:number; sd:number}> = {};
  for (const k of keys) {
    const vals = objArr.map(o => o[k]).filter(v => typeof v === "number");
    result[k] = { avg: +mean(vals).toFixed(2), sd: +stddev(vals).toFixed(2) };
  }
  return result;
}
