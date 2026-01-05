"use client";

import { useState } from "react";
import { createTask, updateTaskStatus, deleteTask } from "@/app/actions";
import { Plus, Trash2, CheckCircle2, Circle, AlertCircle } from "lucide-react";
import { clsx } from "clsx";

type Task = {
  id: string;
  title: string;
  description: string | null;
  status: string;
  priority: string;
  createdAt: Date;
};

export default function TaskList({ initialTasks }: { initialTasks: Task[] }) {
  const [tasks, setTasks] = useState(initialTasks); // Optimistic UI could be improved later
  const [isAdding, setIsAdding] = useState(false);

  // Note: For a real production app we'd use useOptimistic hook, but keeping it simple for now by relying on server revalidation prop passing
  // Actually, since this is a client component receiving props from a server component, we rely on the parent to refresh data or router.refresh()
  // But for better UX let's just use the props directly. The parent page needs to pass updated data.

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-white">My Tasks</h2>
        <button
          onClick={() => setIsAdding(!isAdding)}
          className="flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-500 transition-colors"
        >
          <Plus className="h-4 w-4" />
          Add Task
        </button>
      </div>

      {isAdding && (
        <form action={createTask} onSubmit={() => setIsAdding(false)} className="rounded-lg border border-gray-700 bg-gray-800 p-4 transition-all">
          <div className="grid gap-4">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-300">
                Title
              </label>
              <input
                type="text"
                name="title"
                required
                className="mt-1 block w-full rounded-md border-gray-600 bg-gray-700 px-3 py-2 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                placeholder="What needs to be done?"
              />
            </div>
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-300">
                Description
              </label>
              <textarea
                name="description"
                rows={2}
                className="mt-1 block w-full rounded-md border-gray-600 bg-gray-700 px-3 py-2 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                placeholder="Details..."
              />
            </div>
             <div>
              <label htmlFor="priority" className="block text-sm font-medium text-gray-300">
                Priority
              </label>
              <select
                name="priority"
                className="mt-1 block w-full rounded-md border-gray-600 bg-gray-700 px-3 py-2 text-white focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              >
                <option value="LOW">Low</option>
                <option value="MEDIUM">Medium</option>
                <option value="HIGH">High</option>
              </select>
            </div>
            <div className="flex justify-end gap-2">
                <button type="button" onClick={() => setIsAdding(false)} className="px-3 py-2 text-sm text-gray-400 hover:text-white">Cancel</button>
                <button type="submit" className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-500">Save</button>
            </div>
          </div>
        </form>
      )}

      <div className="space-y-3">
        {initialTasks.length === 0 ? (
          <div className="text-center py-10 text-gray-500">No tasks yet. Create one above!</div>
        ) : (
          initialTasks.map((task) => (
            <div
              key={task.id}
              className="group flex items-center justify-between rounded-lg border border-gray-800 bg-gray-900/50 p-4 transition-all hover:bg-gray-800/50"
            >
              <div className="flex items-start gap-3">
                <button
                    onClick={() => updateTaskStatus(task.id, task.status === "DONE" ? "TODO" : "DONE")}
                    className={clsx("mt-1 h-5 w-5 flex-shrink-0 transition-colors", 
                        task.status === "DONE" ? "text-green-500" : "text-gray-500 hover:text-gray-300"
                    )}
                >
                    {task.status === "DONE" ? <CheckCircle2 /> : <Circle />}
                </button>
                <div>
                  <h3 className={clsx("font-medium text-white", task.status === "DONE" && "line-through text-gray-500")}>
                    {task.title}
                  </h3>
                  {task.description && (
                    <p className="text-sm text-gray-400">{task.description}</p>
                  )}
                  <div className="mt-2 flex items-center gap-2">
                    <span className={clsx("text-xs px-2 py-0.5 rounded-full font-medium",
                        task.priority === "HIGH" ? "bg-red-500/10 text-red-400" :
                        task.priority === "MEDIUM" ? "bg-yellow-500/10 text-yellow-400" :
                        "bg-blue-500/10 text-blue-400"
                    )}>
                        {task.priority}
                    </span>
                  </div>
                </div>
              </div>
              <button 
                onClick={() => deleteTask(task.id)}
                className="opacity-0 group-hover:opacity-100 text-gray-500 hover:text-red-400 transition-opacity p-2"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
