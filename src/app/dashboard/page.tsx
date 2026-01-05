import { Server, Activity, ArrowUpRight } from "lucide-react";

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white tracking-tight">Overview</h1>
        <p className="text-gray-400 mt-2">Welcome back to your local command center.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Stat Card 1 */}
        <div className="rounded-xl border border-gray-800 bg-gray-900/50 p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-gray-400">Total Tasks</h3>
            <Activity className="h-4 w-4 text-blue-500" />
          </div>
          <div className="mt-4 flex items-baseline">
            <span className="text-3xl font-bold text-white">12</span>
            <span className="ml-2 text-sm text-green-400 flex items-center">
                <ArrowUpRight className="h-3 w-3 mr-1" />
                +2 today
            </span>
          </div>
        </div>

        {/* Stat Card 2 */}
        <div className="rounded-xl border border-gray-800 bg-gray-900/50 p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-gray-400">Proxmox Connection</h3>
            <Server className="h-4 w-4 text-purple-500" />
          </div>
          <div className="mt-4 flex items-baseline">
            <span className="text-2xl font-bold text-green-400">Active</span>
            <span className="ml-2 text-sm text-gray-500">14ms latency</span>
          </div>
        </div>

         {/* Stat Card 3 */}
         <div className="rounded-xl border border-gray-800 bg-gray-900/50 p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-gray-400">Pending Review</h3>
            <Activity className="h-4 w-4 text-orange-500" />
          </div>
          <div className="mt-4">
            <span className="text-3xl font-bold text-white">4</span>
          </div>
        </div>
      </div>

      {/* Recent Activity Section */}
      <div className="rounded-xl border border-gray-800 bg-gray-900/50">
        <div className="p-6 border-b border-gray-800">
            <h3 className="text-lg font-semibold text-white">Recent Activity</h3>
        </div>
        <div className="p-6">
            <div className="text-gray-500 text-sm">No recent activity found.</div>
        </div>
      </div>
    </div>
  );
}
