import TaskList from "@/components/TaskList";
import { getTasks } from "@/app/actions";

export const dynamic = 'force-dynamic';

export default async function TasksPage() {
  const tasks = await getTasks();

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-semibold text-slate-100 tracking-tight">タスク管理</h1>
        <p className="mt-2 text-slate-400">Proxmox のアクティビティと個人の目標を管理します。</p>
      </div>
      
      <TaskList initialTasks={tasks} />
    </div>
  );
}
