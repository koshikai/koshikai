"use client";

import { useState } from "react";
import { createTask, updateTaskStatus, deleteTask } from "@/app/actions";
import { Plus, Trash2, CheckCircle2, Circle } from "lucide-react";
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
        <h2 className="text-xl font-semibold text-white">マイタスク</h2>
        <button
          onClick={() => setIsAdding(!isAdding)}
          className="flex items-center gap-2 rounded-full bg-gradient-to-r from-cyan-400 to-amber-400 px-4 py-2 text-sm font-semibold text-slate-950 shadow-sm transition hover:brightness-110"
        >
          <Plus className="h-4 w-4" />
          タスクを追加
        </button>
      </div>

      {isAdding && (
        <form
          action={createTask}
          onSubmit={() => setIsAdding(false)}
          className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur transition-all"
        >
          <div className="grid gap-4">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-slate-300">
                タイトル
              </label>
              <input
                type="text"
                name="title"
                required
                className="mt-1 block w-full rounded-xl border border-white/10 bg-slate-950/60 px-3 py-2 text-white placeholder:text-slate-500 focus:border-cyan-300 focus:outline-none focus:ring-2 focus:ring-cyan-400/30 sm:text-sm"
                placeholder="何をすべきですか？"
              />
            </div>
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-slate-300">
                説明
              </label>
              <textarea
                name="description"
                rows={2}
                className="mt-1 block w-full rounded-xl border border-white/10 bg-slate-950/60 px-3 py-2 text-white placeholder:text-slate-500 focus:border-cyan-300 focus:outline-none focus:ring-2 focus:ring-cyan-400/30 sm:text-sm"
                placeholder="詳細..."
              />
            </div>
             <div>
              <label htmlFor="priority" className="block text-sm font-medium text-slate-300">
                優先度
              </label>
              <select
                name="priority"
                className="mt-1 block w-full rounded-xl border border-white/10 bg-slate-950/60 px-3 py-2 text-white focus:border-cyan-300 focus:outline-none focus:ring-2 focus:ring-cyan-400/30 sm:text-sm"
              >
                <option value="LOW">低</option>
                <option value="MEDIUM">中</option>
                <option value="HIGH">高</option>
              </select>
            </div>
            <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAdding(false)}
                  className="px-3 py-2 text-sm text-slate-400 hover:text-white"
                >
                  キャンセル
                </button>
                <button
                  type="submit"
                  className="rounded-full bg-gradient-to-r from-cyan-400 to-amber-400 px-4 py-2 text-sm font-semibold text-slate-950 shadow-sm hover:brightness-110"
                >
                  保存
                </button>
            </div>
          </div>
        </form>
      )}

      <div className="space-y-3">
        {initialTasks.length === 0 ? (
          <div className="py-10 text-center text-slate-500">タスクがまだありません。上のボタンから作成してください！</div>
        ) : (
          initialTasks.map((task) => (
            <div
              key={task.id}
              className="group flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 p-4 transition-all hover:bg-white/10"
            >
              <div className="flex items-start gap-3">
                <button
                    onClick={() => updateTaskStatus(task.id, task.status === "DONE" ? "TODO" : "DONE")}
                    className={clsx("mt-1 h-5 w-5 flex-shrink-0 transition-colors",
                        task.status === "DONE" ? "text-emerald-400" : "text-slate-500 hover:text-slate-300"
                    )}
                >
                    {task.status === "DONE" ? <CheckCircle2 /> : <Circle />}
                </button>
                <div>
                  <h3 className={clsx("font-medium text-white", task.status === "DONE" && "line-through text-slate-500")}>
                    {task.title}
                  </h3>
                  {task.description && (
                    <p className="text-sm text-slate-400">{task.description}</p>
                  )}
                  <div className="mt-2 flex items-center gap-2">
                    <span className={clsx("text-xs px-2 py-0.5 rounded-full font-medium",
                        task.priority === "HIGH" ? "bg-rose-500/15 text-rose-200" :
                        task.priority === "MEDIUM" ? "bg-amber-500/15 text-amber-200" :
                        "bg-cyan-500/15 text-cyan-200"
                    )}>
                        {task.priority === "HIGH" ? "高" : task.priority === "MEDIUM" ? "中" : "低"}
                    </span>
                  </div>
                </div>
              </div>
              <button 
                onClick={() => deleteTask(task.id)}
                className="opacity-0 group-hover:opacity-100 text-slate-500 hover:text-rose-300 transition-opacity p-2"
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
