import { Server, Activity, ArrowUpRight } from "lucide-react";

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-semibold text-slate-100 tracking-tight">概要</h1>
        <p className="mt-2 text-slate-400">コマンドセンターへおかえりなさい。</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Stat Card 1 */}
        <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-slate-400">合計タスク</h3>
            <Activity className="h-4 w-4 text-cyan-300" />
          </div>
          <div className="mt-4 flex items-baseline">
            <span className="text-3xl font-semibold text-white">12</span>
            <span className="ml-2 flex items-center text-sm text-emerald-300">
                <ArrowUpRight className="h-3 w-3 mr-1" />
                本日 +2
            </span>
          </div>
        </div>

        {/* Stat Card 2 */}
        <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-slate-400">Proxmox 接続</h3>
            <Server className="h-4 w-4 text-amber-300" />
          </div>
          <div className="mt-4 flex items-baseline">
            <span className="text-2xl font-semibold text-emerald-300">アクティブ</span>
            <span className="ml-2 text-sm text-slate-500">レイテンシ 14ms</span>
          </div>
        </div>

         {/* Stat Card 3 */}
         <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-slate-400">レビュー待ち</h3>
            <Activity className="h-4 w-4 text-rose-300" />
          </div>
          <div className="mt-4">
            <span className="text-3xl font-semibold text-white">4</span>
          </div>
        </div>
      </div>

      {/* Recent Activity Section */}
      <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur">
        <div className="border-b border-white/10 p-6">
            <h3 className="text-lg font-semibold text-white">最近のアクティビティ</h3>
        </div>
        <div className="p-6">
            <div className="text-sm text-slate-500">最近のアクティビティはありません。</div>
        </div>
      </div>
    </div>
  );
}
