import { ArrowRight, ArrowUpRight } from "lucide-react";
import { AppLink, isExternalHref } from "@/components/ui";

/**
 * LiquidButton — hover でアクセント色が染み広がる CTA。
 *
 * 一点のドットが拡大してボタンを満たし、ラベルが上下スライドで入れ替わる
 * (例:「Works を見る」→「View Works」)。ラベルは幅の広い方に合わせて
 * 枠が決まるため、入れ替わり時に切れない。
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
  const isExternal = external || isExternalHref(href);
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

  return (
    <AppLink href={href} external={isExternal} className={className_}>
      <span className="lb-dot" aria-hidden="true" />
      <span className="lb-txt">
        <span className="lb-line lb-cur">{label}</span>
        <span className="lb-line lb-nxt" aria-hidden="true">
          <span>{labelNext}</span>
          <Icon className="lb-arw h-3.5 w-3.5 shrink-0" aria-hidden="true" />
        </span>
      </span>
    </AppLink>
  );
}
