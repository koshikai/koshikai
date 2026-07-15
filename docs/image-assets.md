# 画像アセット要件

このサイトの見た目を改善するために必要な画像素材をまとめたものです。
Antigravity 等で画像生成を依頼する際の仕様書として使ってください。

---

## 0. 前提: このサイトのデザインシステム

生成を依頼するすべての画像は、以下の既存デザインに馴染む必要があります。
プロンプトには必ずこの制約を含めてください。

### カラーパレット (`src/app/globals.css`)

| トークン | Light | Dark |
| --- | --- | --- |
| background | `#fafaf7` (温かみのあるオフホワイト) | `#131315` |
| surface | `#f3f2ec` | `#1a1a1d` |
| foreground | `#17171a` | `#ecebe7` |
| muted | `#6b6b71` | `#8e8e88` |
| border | `#e4e3dc` | `#2a2a2c` |
| accent | `#b23a32` (くすんだ朱色 / 弁柄色) | `#e4675b` |

アクセントカラーは**唯一の有彩色**です。画像に他の色相を持ち込むと世界観が壊れます。

### タイポグラフィ

- 見出し: Zen Old Mincho (明朝体、weight 600)
- 本文: Noto Sans JP
- ラベル・数値: JetBrains Mono (大文字 + `letter-spacing: 0.15em〜0.24em`)

### トーン

エディトリアル・ミニマル。罫線 (1px の border) と余白で構造を作り、装飾はほぼありません。
写真もイラストも現状ゼロで、**唯一の画像がネットワーク構成図の SVG のみ**という状態です。

> **重要な方針**: この site は「余白と活字で見せる」設計です。
> 画像は「賑やかしとして足す」のではなく、**文字では伝わらない情報を持つものだけ**を足してください。
> グラデーション、3D レンダリング、光沢、AI っぽいテック風の抽象イメージは**すべて逆効果**です。

---

## 1. 【最優先】ファビコン / アプリアイコンの差し替え

**現状が明確に破綻しています。** 最も費用対効果の高い修正です。

現在の `src/app/icon.png` は、**青〜緑のグラデーションがかかった光沢のある 3D の結び目**です。
朱色 × オフホワイト × 明朝体のエディトリアルなサイト本体と、色相もマテリアルも完全に無関係で、
ブラウザのタブに並んだ瞬間に「別のサイトのアイコン」に見えます。

| 項目 | 内容 |
| --- | --- |
| 差し替え先 | `src/app/icon.png` (512×512), `src/app/apple-icon.png` (180×180), `src/app/favicon.ico` (32×32 + 16×16) |
| 形式 | PNG (透過なし、背景ベタ塗り推奨) |
| 必要バリエーション | 1 種類 (ダーク/ライト両対応にするなら背景は透過または `#fafaf7`) |

### 方向性の案

**案 A: 活字ベースのモノグラム (推奨)**
「k」または「小」の一文字を、Zen Old Mincho 相当の明朝体で組む。
背景 `#fafaf7`、字は `#17171a`、右下または左上に `#b23a32` の小さな正方形か短い罫線を 1 本だけ置く。
16px に縮小しても潰れないよう、字画は太めに。

**案 B: 幾何学的な印 (落款イメージ)**
朱色 `#b23a32` のベタ塗り角丸なし正方形に、白抜きで「k」を 1 文字。
日本の落款・判子のニュアンス。明朝体の縦画/横画のコントラストを残す。

### プロンプト例

```
A minimalist favicon design, 512x512, flat vector, no gradient, no 3D, no gloss.
A single lowercase letter "k" set in a Japanese serif typeface (Mincho / Zen Old Mincho style),
with visible thick-thin stroke contrast and sharp serif terminals.
Ink color #17171a on a warm off-white #fafaf7 background.
One small solid square of muted vermilion #b23a32 placed at the bottom-right as the only accent.
Editorial, restrained, letterpress feeling. Absolutely no bevel, no shadow, no glow, no rounded 3D tubing.
Must remain legible when scaled down to 16x16 pixels.
```

---

## 2. Hero セクションの地紋 / テクスチャ (任意・慎重に)

**場所**: `src/components/PortfolioHome.tsx` の `#hero`

現状は完全な無地に明朝体の一文だけで、これ自体は成立しています。
足すとしても「背景にうっすら敷く紙のテクスチャ」程度に留めるべきで、
主張のあるヒーロー画像を入れると、この site の一番の強みである静けさが消えます。

| 項目 | 内容 |
| --- | --- |
| 配置 | `public/images/hero-texture-light.webp` / `hero-texture-dark.webp` |
| サイズ | 2400×1400 程度 (背景に敷いて `opacity: 0.4` 前後で使用) |
| 形式 | WebP (150KB 以下を目標) |
| 必要バリエーション | **ライト / ダークの 2 枚必須** |

### プロンプト例

```
An extremely subtle paper texture background, 2400x1400.
Warm off-white #fafaf7 handmade Japanese washi paper, seen flat-on under even diffuse light.
Only very faint fiber grain and a barely perceptible tonal variation — contrast must be almost nil.
No pattern, no motif, no illustration, no vignette, no drop shadow, no visible edges.
This is a background that text will be placed on top of; it must never compete with the text.
```

ダーク版は `#131315` の墨色の紙に置き換えて同じ指示。

> 判断: **これは無くても成立します。** 1 の差し替えを先にやって、物足りなければ検討する、で十分です。

---

## 3. ケーススタディの OG 画像 (SNS シェア用)

**場所**: `src/app/cases/[slug]/` — 現状トップページ用の `opengraph-image.tsx` しかなく、
個別ケースを SNS に貼ると**全部同じ OG 画像**になります。

ただし、これは**画像生成ではなくコードで解決するのが正解**です。
トップの `src/app/opengraph-image.tsx` が `next/og` の `ImageResponse` でフォントを読んで描画しているので、
同じ仕組みを `src/app/cases/[slug]/opengraph-image.tsx` に置き、ケースのタイトルを流し込むだけです。

**→ 画像生成の依頼は不要。実装タスクとして別途対応してください。**
(必要なら私の方で実装できます)

---

## 4. AI 生成ではなく「実物」が必要なもの

以下は見た目の改善に効きますが、**AI で生成してはいけない**ものです。
生成すると実在しないものを実在するかのように見せることになり、ポートフォリオの信頼性を損ないます。

### 4-1. プロジェクトのスクリーンショット

`#projects` の Smoke it. / KariGallery は、現状テキストのカードのみです。
実際の画面キャプチャがあると説得力が大きく変わります。

| 項目 | 内容 |
| --- | --- |
| 対象 | https://smoke-it.koshikai.dev , https://gallery.koshikai.dev |
| 配置 | `public/images/projects/smoke-it.webp` , `karigallery.webp` |
| サイズ | 1600×1000 程度 (`ProjectCard` に横並びで入れるなら 800×500) |
| 取得方法 | **実機/実ブラウザでのキャプチャ**。Playwright が既に依存に入っているので自動化可能 |

- Smoke it. は PWA なので、モバイル幅 (390×844) のキャプチャの方が実態に合います。
- KariGallery は現在ダミーデータ運用中なので、キャプチャもダミーデータのままで問題ありません
  (むしろ本文で「ダミーデータ」と明記済みなので整合します)。

### 4-2. 研究セクションの図表

`#research` のブーリアンネットワーク制御は、**図があれば一番伝わるのに現状ゼロ**です。

| 必要な図 | 内容 | 作り方 |
| --- | --- | --- |
| BN の状態遷移 / エッジ除去の概念図 | Cortical Development や Wnt5a のネットワーク構造とエッジ除去制御 | 研究で使っている実データから matplotlib / graphviz で描画 |
| Q学習の学習曲線 | 制御成功率 100% に至る収束の様子 | Marimo 環境の実験結果から出力 |
| C2D の転移概念図 | n25 → n39 モデルへの Action-Prior Transfer | 自作の図 (draw.io 等) |

これらは**論文の実データそのもの**なので、AI に「それっぽい図」を描かせると捏造になります。
既に Marimo で再現可能な実験環境を持っているとのことなので、そこから出力するのが最短です。

出力時のスタイル指定 (matplotlib):
- 背景 `#fafaf7` / 線 `#17171a` / 強調 `#b23a32` / グリッド `#e4e3dc`
- フォント JetBrains Mono (軸ラベル)
- ダークモード用に `#131315` 背景版も出力するか、SVG で `currentColor` を使う

### 4-3. About セクションの顔写真 (任意)

`#about` は「自分で直したい」という一人称の語りなので、本人写真があると効きます。
ただし**本人の実写に限ります**。AI 生成のポートレートを自分として載せるのは論外です。

| 項目 | 内容 |
| --- | --- |
| 配置 | `public/images/portrait.webp` |
| サイズ | 800×1000 (縦位置) |
| トーン | 自然光、無彩色に近い背景、加工は最小限。サイトの静けさに合わせる |

> 判断: このサイトのトーンなら**無くても全く問題ありません**。入れるかは好みで。

---

## 5. 既存アセットの改善: ネットワーク構成図

`public/images/home-network-final.drawio.svg` (**469KB**) が
`src/content/cases/immich-distributed.mdx` で使われています。

これは画像生成の話ではなく最適化の話です:

- **469KB は SVG として異常に重い** — draw.io の書き出しに不要なメタデータや埋め込みフォントが入っている可能性が高い。SVGO をかければ大幅に落ちるはずです。
- **ダークモード時に浮く** — draw.io のデフォルト書き出しは白背景・黒線なので、`#131315` の背景の上で白い矩形として浮きます。SVG 内の色を CSS 変数か `currentColor` に置き換えるか、ダーク版を別途書き出すのが望ましいです。
- 図の中身自体は実構成なので、**作り直す必要はありません**。

---

## まとめ: 画像生成に出すもの / 出さないもの

| # | 素材 | 優先度 | 生成依頼 |
| --- | --- | --- | --- |
| 1 | ファビコン / アプリアイコン | **高** | ✅ 出す (§1 のプロンプト) |
| 2 | Hero の紙テクスチャ | 低 | △ 任意 (§2 のプロンプト) |
| 3 | ケース別 OG 画像 | 中 | ❌ コードで生成 (`next/og`) |
| 4-1 | プロジェクトのスクショ | **高** | ❌ 実ブラウザでキャプチャ |
| 4-2 | 研究の図表 | **高** | ❌ 実験の実データから出力 |
| 4-3 | 顔写真 | 低 | ❌ 実写のみ |
| 5 | ネットワーク構成図 | 中 | ❌ 既存 SVG を最適化 |

**Antigravity に出すのは実質 §1 (アイコン)、必要なら §2 (テクスチャ) だけです。**
見た目のインパクトが一番大きいのは §1 のアイコン差し替えと、§4-1 / §4-2 の「実物を載せる」ことで、
後者は画像生成ではなくキャプチャと図の出力の作業になります。
