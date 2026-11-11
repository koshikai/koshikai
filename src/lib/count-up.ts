/**
 * 数え上げの途中の表示を作る。
 *
 * 文字列の中の数値だけを progress（0..1）倍にし、記号や単位はそのまま残す
 * （"96/96" "43.2×" "10+"）。小数の桁数は元の表記に合わせるので、
 * 途中で桁が増減して幅が揺れることはない。
 */
export function countFrame(value: string, progress: number): string {
  const t = Math.min(1, Math.max(0, progress));
  return value
    .split(/(\d+(?:\.\d+)?)/)
    .map((part, i) => (i % 2 ? (Number(part) * t).toFixed(part.split(".")[1]?.length ?? 0) : part))
    .join("");
}
