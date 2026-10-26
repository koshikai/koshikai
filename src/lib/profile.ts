/**
 * サイト上の人物情報。
 *
 * 識別子はハンドル `koshikai` で通す。ドメイン・GitHub・構造化データの
 * Person.name もすべて koshikai なので、本名を足すと識別子が2つに割れる。
 *
 * 所属・学歴は About にだけ出す。Hero 周辺に所属や受賞を置くと
 * 「何ができる人か」より肩書きが先に読まれるため。
 */

export interface ContactLink {
  label: string;
  href: string;
  /** 画面上に出す短い表記（例: @koshikai） */
  handle: string;
}

export interface Availability {
  /** 例: "2027年夏のインターンシップを探しています" */
  message: string;
  /** 例: "2026-09" — いつ時点の情報かを必ず添える */
  asOf: string;
}

export interface EducationItem {
  period: string;
  title: string;
  detail?: string;
}

export const profile = {
  name: "koshikai",
  role: "Software Engineer / Graduate Student",
  lead: "Web・AI のプロダクトを自分で作り、自宅のインフラで動かし続け、研究とデータで検証しています。",
  keywords: ["build", "operate", "research"] as const,

  /**
   * 公開用の連絡先。email は公開してよいアドレスが決まったら入れる。
   * null の間は画面に出さない。
   */
  contact: {
    email: "contact@koshikai.dev" as string | null,
    links: [
      { label: "GitHub", href: "https://github.com/koshikai", handle: "@koshikai" },
      { label: "X", href: "https://x.com/siywyk", handle: "@siywyk" },
    ] satisfies ContactLink[],
  },

  /**
   * 就職・インターンの募集状況。固定の文言にせず、必要な時期だけ値を入れる。
   * null なら About にもフッターにも何も出さない。
   */
  availability: null as Availability | null,

  education: [
    {
      period: "現在",
      title: "北海道大学 大学院情報科学院 修士課程 1年",
      detail: "ブーリアンネットワークの制御と、モデル間の制御知識の転移を研究",
    },
  ] satisfies EducationItem[],
};
