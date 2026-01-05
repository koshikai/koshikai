"use client";

import { useState } from "react";
import { updateProfile } from "@/app/actions";
import { User, Mail, Save, CheckCircle2, AlertCircle } from "lucide-react";
import { useFormStatus } from "react-dom";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-xl font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-blue-500/20"
    >
      <Save className="w-4 h-4" />
      {pending ? "保存中..." : "設定を保存"}
    </button>
  );
}

export default function SettingsForm({ user }: { user: any }) {
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  async function action(formData: FormData) {
    setMessage(null);
    const result = await updateProfile(formData);
    if (result.error) {
      setMessage({ type: "error", text: result.error });
    } else if (result.success) {
      setMessage({ type: "success", text: result.success });
      // Clear success message after 3 seconds
      setTimeout(() => setMessage(null), 3000);
    }
  }

  return (
    <div className="w-full max-w-2xl bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-2xl">
      <form action={action} className="space-y-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-2 ml-1">名前</label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500 group-focus-within:text-blue-500 transition-colors">
                <User className="w-5 h-5" />
              </div>
              <input
                type="text"
                name="name"
                defaultValue={user?.name || ""}
                placeholder="あなたの名前"
                className="w-full bg-slate-900/50 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-400 mb-2 ml-1">メールアドレス</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500">
                <Mail className="w-5 h-5" />
              </div>
              <input
                type="email"
                value={user?.email || ""}
                disabled
                className="w-full bg-slate-900/30 border border-white/5 rounded-xl py-3 pl-12 pr-4 text-slate-500 cursor-not-allowed"
              />
            </div>
            <p className="mt-2 text-xs text-slate-500 ml-1">メールアドレスは変更できません</p>
          </div>
        </div>

        {message && (
          <div className={`p-4 rounded-xl flex items-center gap-3 animate-in fade-in slide-in-from-top-2 duration-300 ${
            message.type === "success" ? "bg-emerald-500/10 border border-emerald-500/20 text-emerald-400" : "bg-red-500/10 border border-red-500/20 text-red-400"
          }`}>
            {message.type === "success" ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
            <p className="text-sm font-medium">{message.text}</p>
          </div>
        )}

        <div className="pt-4 flex justify-end">
          <SubmitButton />
        </div>
      </form>
    </div>
  );
}
