import { capabilities } from "./engineering";

/**
 * トップで流すキーワード。
 *
 * 技術名は engineering.ts の capabilities から導出する。あちらは
 * 「実際に使った技術だけを、作品で裏付けて載せる」ルールで管理しているので、
 * ここに手書きの配列を持つと、根拠のない技術がマーキーにだけ載る余地ができる。
 */

/** 並べると情報量が薄いものは流さない（技術名ではなく運用方針・前提・略語） */
const OMIT = new Set(["self-hosting", "self-hosted runner", "GHCR", "Linux", "PWA"]);

export const marqueeStack: string[] = [
  ...new Set(capabilities.flatMap((capability) => capability.tools)),
].filter((tool) => !OMIT.has(tool));

/**
 * 逆方向に流す 2 行目。build / operate / research を実際の手の動きに開いたもの。
 * 肩書きではなく作業を並べ、Hero の主張を言い換えずに補強する。
 */
export const marqueeWork: string[] = [
  "作る",
  "公開する",
  "動かし続ける",
  "壊れたら直す",
  "計測する",
  "確かめる",
];
