"use client";

import { useCallback, useState } from "react";

import { Check, Copy, Download, FileCode2, Terminal } from "lucide-react";
import {
  buildCombinedSource,
  buildUnpackScript,
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
  icon?: React.ReactNode;
}

function CopyButton({
  label,
  text,
  variant = "ghost",
  icon,
}: CopyButtonProps) {
  const [state, setState] = useState<"idle" | "copied" | "failed">("idle");

  const handleCopy = useCallback(async () => {
    const ok = await writeToClipboard(text);
    setState(ok ? "copied" : "failed");
    window.setTimeout(() => setState("idle"), 2000);
  }, [text]);

  const base =
    "focus-ring inline-flex items-center gap-2 rounded-sm px-3 py-2 font-mono text-xs tracking-[0.08em] transition-colors cursor-pointer";
  const styles =
    variant === "primary"
      ? "border border-accent bg-accent-weak text-accent hover:bg-accent hover:text-background"
      : "border border-border text-muted hover:border-accent hover:text-accent";

  return (
    <button type="button" onClick={handleCopy} className={`${base} ${styles}`}>
      {state === "copied" ? (
        <Check className="h-3.5 w-3.5" aria-hidden="true" />
      ) : icon ? (
        icon
      ) : (
        <Copy className="h-3.5 w-3.5" aria-hidden="true" />
      )}
      {state === "copied" ? "コピーした" : state === "failed" ? "失敗した" : label}
    </button>
  );
}

function DownloadButton({
  filename,
  content,
  label,
}: {
  filename: string;
  content: string;
  label: string;
}) {
  const handleDownload = useCallback(() => {
    const blob = new Blob([content], { type: "text/x-python;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, [content, filename]);

  return (
    <button
      type="button"
      onClick={handleDownload}
      className="focus-ring inline-flex items-center gap-2 rounded-sm border border-accent bg-accent-weak px-3 py-2 font-mono text-xs tracking-[0.08em] text-accent transition-colors hover:bg-accent hover:text-background cursor-pointer"
    >
      <Download className="h-3.5 w-3.5" aria-hidden="true" />
      {label}
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

  const unpackScript = buildUnpackScript(hvacCode);

  return (
    <section aria-label="ソースコード">
      {/* 別のPCへのセットアップ・一括取得エリア */}
      <div className="mb-8 rounded-sm border border-border bg-subtle/20 p-5">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="font-mono text-xs font-semibold uppercase tracking-[0.14em] text-foreground">
              別PCでのセットアップ用ファイル一式（全 {hvacCode.files.length} ファイル / {hvacCodeTotalLines.toLocaleString()} 行）
            </p>
            <p className="mt-1 max-w-2xl text-sm leading-[1.8] text-muted">
              別のパソコンで動かすには、以下のいずれかの方法で全ファイルを一括取得・展開できます。
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <DownloadButton
              filename="unpack.py"
              content={unpackScript}
              label="unpack.py をダウンロード"
            />
            <CopyButton
              label="復元スクリプトをコピー"
              text={unpackScript}
              icon={<Terminal className="h-3.5 w-3.5" aria-hidden="true" />}
              variant="primary"
            />
            <CopyButton
              label="全コードを結合コピー"
              text={buildCombinedSource(hvacCode)}
            />
          </div>
        </div>

        <div className="mt-4 rounded-sm border border-border/60 bg-background/80 p-3 font-mono text-[11px] leading-[1.7] text-muted">
          <p className="font-semibold text-foreground">別のパソコンでの最短セットアップ:</p>
          <ol className="mt-1 list-decimal pl-5 space-y-0.5">
            <li>空フォルダを作成し、ダウンロードした <code className="text-foreground">unpack.py</code> を配置して実行: <code className="text-foreground">python unpack.py</code>（全ディレクトリ・{hvacCode.files.length}ファイルが自動生成されます）</li>
            <li>依存ライブラリをインストール: <code className="text-foreground">uv sync</code></li>
            <li>初期データ準備とモデル学習: <code className="text-foreground">uv run scripts/generate_dummy_data.py && uv run scripts/fit_models.py</code></li>
            <li>意思決定支援アプリ起動: <code className="text-foreground">uv run streamlit run app.py</code></li>
          </ol>
        </div>
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
