import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";

/**
 * LiquidButton — hover でアクセント色が染み広がる CTA。
 *
 * 一点のドットが拡大してボタンを満たし、ラベルが上下スライドで入れ替わる
 * (例:「Works を見る」→「View Works」)。ラベルは幅の広い方に合わせて
 * 枠が決まるため、入れ替わり時に切れない。
 *
 * ButtonLink (ui.tsx) と寸法・角丸をそろえ、Hero など主要な導線だけ
 * これに差し替える。
 */
type LiquidButtonProps = {
  href: string;
  /** 通常時のラベル */
  label: string;
  /** hover 時にスライドインするラベル */
  labelNext: string;
  variant?: "primary" | "outline";
  className?: string;
  /** 外部リンクは別タブ + ↗ */
  external?: boolean;
};

export function LiquidButton({
  href,
  label,
  labelNext,
  variant = "primary",
  className = "",
  external = false,
}: LiquidButtonProps) {
  const isOutline = variant === "outline";
  const isExternal = external || /^https?:\/\//.test(href);
  const Icon = isExternal ? ArrowUpRight : ArrowRight;

  const className_ = [
    "liquid-btn focus-ring inline-flex min-h-11 items-center justify-center rounded border px-5 text-sm font-medium",
    isOutline
      ? "border-border bg-background text-foreground hover:text-background"
      : "border-foreground bg-foreground text-background hover:text-background",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  const content = (
    <>
      <span className="lb-dot" aria-hidden="true" />
      <span className="lb-txt">
        <span className="lb-line lb-cur">{label}</span>
        <span className="lb-line lb-nxt" aria-hidden="true">
          <span>{labelNext}</span>
          <Icon className="lb-arw h-3.5 w-3.5 shrink-0" aria-hidden="true" />
        </span>
      </span>
    </>
  );

  return isExternal ? (
    <a href={href} target="_blank" rel="noopener noreferrer" className={className_}>
      {content}
    </a>
  ) : (
    <Link href={href} className={className_}>
      {content}
    </Link>
  );
}
