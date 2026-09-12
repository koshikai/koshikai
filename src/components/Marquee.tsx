import type { CSSProperties } from "react";

/**
 * Marquee — 無限に流れる 1 行。
 *
 * 同じ内容を 2 セット並べ、translateX(-50%) で折り返す。等間隔は
 * アイテム側の水平 padding で作るため、ループの継ぎ目でズレない
 * (flex の gap を使うと -50% の位置が半端になり、切り替わりが見える)。
 * hover で停止、reduced-motion では静止する。
 */
type MarqueeProps = {
  items: readonly string[];
  /** 逆方向に流す (2 行重ねるとき用) */
  reverse?: boolean;
  /** 1 周にかける秒数 */
  duration?: number;
  className?: string;
  itemClassName?: string;
};

export function Marquee({
  items,
  reverse = false,
  duration = 44,
  className = "",
  itemClassName = "",
}: MarqueeProps) {
  if (items.length === 0) return null;
  const doubled = [...items, ...items];

  return (
    <div className={`marquee ${className}`.trim()}>
      <div
        className={reverse ? "marquee-track rev" : "marquee-track"}
        style={{ "--m-d": `${duration}s` } as CSSProperties}
      >
        {doubled.map((item, i) => (
          <span
            key={i}
            className={`whitespace-nowrap px-[1.4em] ${itemClassName}`.trim()}
            // 2 セット目は読み上げ対象から外す (同じ内容を 2 回読ませない)。
            // false を渡すと aria-hidden="false" が残るので、無指定に揃える。
            aria-hidden={i >= items.length ? true : undefined}
          >
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}
