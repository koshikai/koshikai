"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { auth, signIn, signOut } from "@/auth";
import bcrypt from "bcryptjs";

export async function register(prevState: any, formData: FormData) {
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!email || !password) return { error: "入力されていない項目があります" };

  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) return { error: "ユーザーは既に存在します" };

  const hashedPassword = await bcrypt.hash(password, 10);

  await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
    },
  });

  redirect("/login");
}

export async function login(prevState: any, formData: FormData) {
  try {
    await signIn("credentials", formData);
  } catch (error: any) {
    if (
      error.type === "CredentialsSignin" ||
      error.message?.includes("CredentialsSignin")
    ) {
      return { error: "メールアドレスまたはパスワードが正しくありません" };
    }
    // Redirecting is expected behavior in Auth.js, so throw it if it's a redirect error
    if (error.message === "NEXT_REDIRECT") throw error;
    throw error;
  }
}

export async function logout() {
  await signOut({ redirectTo: "/" });
}

export async function getTasks() {
  const session = await auth();
  if (!session?.user?.id) return [];

  return await prisma.task.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
  });
}

export async function createTask(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) return;

  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const priority = formData.get("priority") as string;

  if (!title) return;

  await prisma.task.create({
    data: {
      title,
      description,
      priority,
      status: "TODO",
      userId: session.user.id,
    },
  });

  revalidatePath("/dashboard/tasks");
}

export async function updateTaskStatus(taskId: string, newStatus: string) {
  const session = await auth();
  if (!session?.user?.id) return;

  await prisma.task.update({
    where: { id: taskId, userId: session.user.id },
    data: { status: newStatus },
  });
  revalidatePath("/dashboard/tasks");
}

export async function deleteTask(taskId: string) {
  const session = await auth();
  if (!session?.user?.id) return;

  await prisma.task.delete({
    where: { id: taskId, userId: session.user.id },
  });
  revalidatePath("/dashboard/tasks");
}

export async function updateProfile(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) return { error: "認証が必要です" };

  const name = formData.get("name") as string;
  if (!name) return { error: "名前を入力してください" };

  try {
    await prisma.user.update({
      where: { id: session.user.id },
      data: { name },
    });

    revalidatePath("/dashboard/settings");
    return { success: "プロフィールを更新しました" };
  } catch (error) {
    return { error: "更新に失敗しました" };
  }
}
