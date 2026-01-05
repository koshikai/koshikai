import { Server, Activity, ArrowUpRight, Cpu, HardDrive } from "lucide-react";
import { getTasks } from "@/app/actions";
import { getClusterStatistics } from "@/app/proxmoxActions";

export default async function DashboardPage() {
  const [tasks, stats] = await Promise.all([
    getTasks(),
    getClusterStatistics(),
  ]);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-semibold text-slate-100 tracking-tight">概要</h1>
        <p className="mt-2 text-slate-400">コマンドセンターへおかえりなさい。</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Task Stats */}
        <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-slate-400">進行中のタスク</h3>
            <Activity className="h-4 w-4 text-cyan-300" />
          </div>
          <div className="mt-4 flex items-baseline">
            <span className="text-3xl font-semibold text-white">{tasks.length}</span>
            <span className="ml-2 text-sm text-slate-500">
                合計 {tasks.length} 件
            </span>
          </div>
        </div>

        {/* Proxmox Node Stats */}
        <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-slate-400">Proxmox ノード</h3>
            <Server className="h-4 w-4 text-amber-300" />
          </div>
          <div className="mt-4 flex items-baseline">
            <span className="text-3xl font-semibold text-white">{stats.onlineNodes}</span>
            <span className="ml-2 text-sm text-slate-500">
                / {stats.nodeCount} 稼働中
            </span>
          </div>
        </div>

         {/* VM & Container Stats */}
         <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-slate-400">VM & コンテナ</h3>
            <Cpu className="h-4 w-4 text-rose-300" />
          </div>
          <div className="mt-4 flex items-baseline">
            <span className="text-3xl font-semibold text-white">{stats.runningVms + stats.runningContainers}</span>
            <span className="ml-2 text-sm text-slate-500">
                / {stats.vmCount + stats.containerCount} 実行中
            </span>
          </div>
        </div>
      </div>

      {/* Cluster Details Grid */}
      <div className="grid gap-6 grid-cols-1 md:grid-cols-2">
        {/* VM Status */}
        <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur">
            <div className="border-b border-white/10 p-6">
                <h3 className="text-lg font-semibold text-white">仮想マシン (VM)</h3>
            </div>
            <div className="p-6">
                <div className="flex justify-between items-center">
                    <span className="text-slate-400">稼働数:</span>
                    <span className="text-white font-medium">{stats.runningVms} / {stats.vmCount}</span>
                </div>
            </div>
        </div>

        {/* Container Status */}
        <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur">
            <div className="border-b border-white/10 p-6">
                <h3 className="text-lg font-semibold text-white">LXC コンテナ</h3>
            </div>
            <div className="p-6">
                <div className="flex justify-between items-center">
                    <span className="text-slate-400">稼働数:</span>
                    <span className="text-white font-medium">{stats.runningContainers} / {stats.containerCount}</span>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
}
