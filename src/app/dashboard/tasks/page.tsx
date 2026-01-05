import TaskList from "@/components/TaskList";
import { getTasks } from "@/app/actions";

export const dynamic = 'force-dynamic';

export default async function TasksPage() {
  const tasks = await getTasks();

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white tracking-tight">Task Management</h1>
        <p className="text-gray-400 mt-2">Manage your Proxmox activities and personal goals.</p>
      </div>
      
      <TaskList initialTasks={tasks} />
    </div>
  );
}
