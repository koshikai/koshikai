/** 通し番号を 2 桁でそろえる（1 → "01"） */
export const pad2 = (n: number) => String(n).padStart(2, "0");
