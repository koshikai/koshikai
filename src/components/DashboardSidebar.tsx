"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, CheckSquare, Settings, LogOut, Server } from "lucide-react";
import { clsx } from "clsx";
import { logout } from "@/app/actions";

const navigation = [
  { name: "ダッシュボード", href: "/dashboard", icon: LayoutDashboard },
  { name: "マイタスク", href: "/dashboard/tasks", icon: CheckSquare },
  { name: "設定", href: "/dashboard/settings", icon: Settings },
];

export function DashboardSidebar({ user }: { user: any }) {
  const pathname = usePathname();

  return (
    <div className="flex h-full w-64 flex-col border-r border-white/10 bg-slate-950/80 backdrop-blur">
      <div className="flex h-16 shrink-0 items-center px-6 border-b border-white/10 safe-top">
        <Server className="mr-2 h-6 w-6 text-cyan-300" />
        <span className="text-lg font-semibold text-white tracking-tight">
          Koshikai<span className="text-cyan-300">.PMX</span>
        </span>
      </div>
      <nav className="flex flex-1 flex-col px-4 py-4 gap-1">
        {navigation.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={clsx(
                "group flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "bg-cyan-500/10 text-cyan-200"
                  : "text-slate-400 hover:bg-white/5 hover:text-white"
              )}
            >
              <item.icon
                className={clsx(
                  "mr-3 h-5 w-5 flex-shrink-0 transition-colors",
                  isActive ? "text-cyan-200" : "text-slate-500 group-hover:text-slate-300"
                )}
                aria-hidden="true"
              />
              {item.name}
            </Link>
          );
        })}
      </nav>
      <div className="border-t border-white/10 p-4">
        <div className="flex items-center gap-3 px-2 py-2 mb-2">
            <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-cyan-400 to-amber-400 flex items-center justify-center text-xs font-bold text-slate-950">
                {user?.name?.[0] || user?.email?.[0] || "U"}
            </div>
            <div className="flex flex-col overflow-hidden">
                <span className="text-sm font-medium text-white truncate">{user?.name || "ユーザー"}</span>
                <span className="text-xs text-slate-400 truncate">{user?.email || "Proxmox ホスト"}</span>
            </div>
        </div>
        <form action={logout}>
            <button className="w-full flex items-center rounded-md px-3 py-2 text-sm font-medium text-rose-300 hover:bg-rose-500/10 hover:text-rose-200 transition-colors">
                <LogOut className="mr-3 h-5 w-5" />
                ログアウト
            </button>
        </form>
      </div>
    </div>
  );
}
