import { auth } from "@/auth";
import SettingsForm from "@/components/SettingsForm";
import { Settings } from "lucide-react";

export default async function SettingsPage() {
  const session = await auth();
  
  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      <div className="flex flex-col gap-1 text-left">
        <div className="flex items-center gap-3 text-blue-500 mb-2">
          <Settings className="w-6 h-6" />
          <h1 className="text-3xl font-bold text-white tracking-tight">設定</h1>
        </div>
        <p className="text-slate-400 text-lg">
          アカウント情報とアプリケーションの設定を管理します。
        </p>
      </div>

      <div className="grid grid-cols-1 gap-8">
        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-white/90 px-1">プロフィール設定</h2>
          <SettingsForm user={session?.user} />
        </section>

        <section className="space-y-4 opacity-50">
          <h2 className="text-xl font-semibold text-white/90 px-1">アプリケーション設定 (Coming Soon)</h2>
          <div className="bg-white/5 border border-white/10 rounded-2xl p-8">
            <p className="text-slate-500 italic">テーマ、通知、言語などの詳細設定は準備中です。</p>
          </div>
        </section>
      </div>
    </div>
  );
}
