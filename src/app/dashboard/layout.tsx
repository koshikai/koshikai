import { DashboardSidebar } from "@/components/DashboardSidebar";
import { auth } from "@/auth";
import Link from "next/link";
import { LayoutDashboard, CheckSquare, Settings } from "lucide-react";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  return (
    <div className="flex h-[100dvh] bg-[#0b0f1a] overflow-hidden">
      {/* Sidebar hidden on mobile */}
      <div className="hidden md:flex h-full">
        <DashboardSidebar user={session?.user} />
      </div>

      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Mobile Header (Mobile only) */}
        <header className="md:hidden flex items-center justify-between px-6 py-4 border-b border-white/10 bg-slate-950/50 backdrop-blur-md safe-top">
           <div className="flex items-center gap-2">
             <div className="h-8 w-8 rounded-lg bg-gradient-to-tr from-cyan-400 to-blue-500 flex items-center justify-center">
               <span className="text-[10px] font-black text-white">PMX</span>
             </div>
             <span className="text-lg font-bold text-white tracking-tight">Koshikai</span>
           </div>
           <div className="h-8 w-8 rounded-full bg-slate-800 border border-white/10" />
        </header>

        <main className="flex-1 overflow-y-auto p-4 md:p-8 safe-bottom">
          <div className="mx-auto max-w-6xl w-full">
            {children}
          </div>
        </main>

        {/* Bottom Nav for Mobile */}
        <nav className="md:hidden grid grid-cols-3 border-t border-white/10 bg-slate-950/80 backdrop-blur-xl safe-bottom">
           <Link href="/dashboard" className="flex flex-col items-center py-3 text-slate-400 hover:text-cyan-400">
             <LayoutDashboard className="w-5 h-5 mb-1" />
             <span className="text-[10px]">概要</span>
           </Link>
           <Link href="/dashboard/tasks" className="flex flex-col items-center py-3 text-slate-400 hover:text-cyan-400">
             <CheckSquare className="w-5 h-5 mb-1" />
             <span className="text-[10px]">タスク</span>
           </Link>
           <Link href="/dashboard/settings" className="flex flex-col items-center py-3 text-slate-400 hover:text-cyan-400">
             <Settings className="w-5 h-5 mb-1" />
             <span className="text-[10px]">設定</span>
           </Link>
        </nav>
      </div>
    </div>
  );
}
