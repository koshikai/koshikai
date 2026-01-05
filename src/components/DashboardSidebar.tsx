"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, CheckSquare, Settings, LogOut, Server } from "lucide-react";
import { clsx } from "clsx";
import { logout } from "@/app/actions";

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "My Tasks", href: "/dashboard/tasks", icon: CheckSquare },
  { name: "Settings", href: "/dashboard/settings", icon: Settings },
];

export function DashboardSidebar({ user }: { user: any }) {
  const pathname = usePathname();

  return (
    <div className="flex h-full w-64 flex-col bg-gray-900 border-r border-gray-800">
      <div className="flex h-16 shrink-0 items-center px-6 border-b border-gray-800">
        <Server className="h-6 w-6 text-blue-500 mr-2" />
        <span className="text-lg font-bold text-white tracking-tight">Koshikai<span className="text-blue-500">.PMX</span></span>
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
                  ? "bg-blue-600/10 text-blue-400"
                  : "text-gray-400 hover:bg-gray-800 hover:text-white"
              )}
            >
              <item.icon
                className={clsx(
                  "mr-3 h-5 w-5 flex-shrink-0 transition-colors",
                  isActive ? "text-blue-400" : "text-gray-500 group-hover:text-gray-300"
                )}
                aria-hidden="true"
              />
              {item.name}
            </Link>
          );
        })}
      </nav>
      <div className="border-t border-gray-800 p-4">
        <div className="flex items-center gap-3 px-2 py-2 mb-2">
            <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-purple-500 to-blue-500 flex items-center justify-center text-xs font-bold text-white">
                {user?.name?.[0] || user?.email?.[0] || "U"}
            </div>
            <div className="flex flex-col overflow-hidden">
                <span className="text-sm font-medium text-white truncate">{user?.name || "User"}</span>
                <span className="text-xs text-gray-500 truncate">{user?.email || "Proxmox Host"}</span>
            </div>
        </div>
        <form action={logout}>
            <button className="w-full flex items-center rounded-md px-3 py-2 text-sm font-medium text-red-400 hover:bg-red-400/10 hover:text-red-300 transition-colors">
                <LogOut className="mr-3 h-5 w-5" />
                Sign out
            </button>
        </form>
      </div>
    </div>
  );
}
