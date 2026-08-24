"use client";

import { useCallback, useState } from "react";
import { Check, Copy, FileCode2 } from "lucide-react";
import {
  buildCombinedSource,
  hvacCode,
  hvacCodeTotalLines,
  type HvacCodeFile,
} from "@/lib/hvac-code";

/**
 * クリップボードへ書き込む。
 *
 * navigator.clipboard は HTTPS でしか使えず、権限を拒否されることもある。
 * このページはコードを持ち出すためだけに存在するので、失敗したときは
 * 旧来の execCommand へ落として、コピー自体は成立させる。
 */
async function writeToClipboard(text: string): Promise<boolean> {
  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch {
    // フォールバックへ進む
  }

  try {
    const textarea = document.createElement("textarea");
    textarea.value = text;
    // 画面外に置く。display:none だと選択できない。
    textarea.style.position = "fixed";
    textarea.style.left = "-9999px";
    document.body.appendChild(textarea);
    textarea.select();
    const ok = document.execCommand("copy");
    document.body.removeChild(textarea);
    return ok;
  } catch {
    return false;
  }
}

interface CopyButtonProps {
  label: string;
  text: string;
  variant?: "primary" | "ghost";
}

function CopyButton({ label, text, variant = "ghost" }: CopyButtonProps) {
  const [state, setState] = useState<"idle" | "copied" | "failed">("idle");

  const handleCopy = useCallback(async () => {
    const ok = await writeToClipboard(text);
    setState(ok ? "copied" : "failed");
    window.setTimeout(() => setState("idle"), 2000);
  }, [text]);

  const base =
    "focus-ring inline-flex items-center gap-2 rounded-sm px-3 py-2 font-mono text-xs tracking-[0.08em] transition-colors";
  const styles =
    variant === "primary"
      ? "border border-accent bg-accent-weak text-accent hover:bg-accent hover:text-background"
      : "border border-border text-muted hover:border-accent hover:text-accent";

  return (
    <button type="button" onClick={handleCopy} className={`${base} ${styles}`}>
      {state === "copied" ? (
        <Check className="h-3.5 w-3.5" aria-hidden="true" />
      ) : (
        <Copy className="h-3.5 w-3.5" aria-hidden="true" />
      )}
      {state === "copied" ? "コピーした" : state === "failed" ? "失敗した" : label}
    </button>
  );
}

/**
 * コード本体。
 *
 * 行番号は ::before で描くので、範囲選択してもコピーされない。
 * 選択でのコピーとボタンでのコピーで結果が変わらないようにするため。
 */
function CodeBlock({ file }: { file: HvacCodeFile }) {
  const lines = file.code.replace(/\n$/, "").split("\n");

  return (
    <pre className="code-block overflow-x-auto rounded-sm border border-border bg-subtle/20 p-4 text-[12.5px] leading-[1.7]">
      <code className="font-mono">
        {lines.map((line, index) => (
          <span
            key={index}
            className="code-line"
            data-line-number={String(index + 1)}
          >
            {line === "" ? " " : line}
            {"\n"}
          </span>
        ))}
      </code>
    </pre>
  );
}

export function CodeViewer() {
  const [activePath, setActivePath] = useState(hvacCode.files[0]?.path ?? "");

  const activeFile =
    hvacCode.files.find((file) => file.path === activePath) ??
    hvacCode.files[0];

  if (!activeFile) {
    return <p className="text-sm text-muted">表示できるファイルがない。</p>;
  }

  return (
    <section aria-label="ソースコード">
      {/* まとめてコピー。git が使えない環境へ移すときはこちらを使う。 */}
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4 rounded-sm border border-border bg-subtle/20 p-4">
        <div>
          <p className="font-mono text-xs uppercase tracking-[0.14em] text-foreground">
            全 {hvacCode.files.length} ファイル / {hvacCodeTotalLines.toLocaleString()} 行
          </p>
          <p className="mt-1 text-sm text-muted">
            ファイル区切りを含めて 1 つのテキストにまとめてコピーする。
          </p>
        </div>
        <CopyButton
          label="全ファイルをコピー"
          text={buildCombinedSource(hvacCode)}
          variant="primary"
        />
      </div>

      {/* ファイル切り替え */}
      <div
        role="tablist"
        aria-label="ファイル"
        className="mb-4 flex flex-wrap gap-2"
      >
        {hvacCode.files.map((file) => {
          const selected = file.path === activeFile.path;
          return (
            <button
              key={file.path}
              type="button"
              role="tab"
              aria-selected={selected}
              onClick={() => setActivePath(file.path)}
              className={`focus-ring inline-flex items-center gap-2 rounded-sm border px-3 py-2 font-mono text-[11px] transition-colors ${
                selected
                  ? "border-accent bg-accent-weak text-accent"
                  : "border-border text-muted hover:border-accent hover:text-accent"
              }`}
            >
              <FileCode2 className="h-3.5 w-3.5" aria-hidden="true" />
              {file.path}
            </button>
          );
        })}
      </div>

      {/* 選択中のファイル */}
      <div className="mb-3 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="font-mono text-sm text-foreground">{activeFile.path}</h2>
          <p className="mt-1 max-w-2xl text-sm leading-[1.8] text-muted">
            {activeFile.description}
          </p>
          <p className="mt-1 font-mono text-[11px] text-muted">
            {activeFile.language} / {activeFile.lines.toLocaleString()} 行
          </p>
        </div>
        <CopyButton label="このファイルをコピー" text={activeFile.code} />
      </div>

      <CodeBlock file={activeFile} />
    </section>
  );
}
