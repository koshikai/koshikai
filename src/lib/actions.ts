"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";

export async function setSiteVariant(variant: "portfolio" | "mathkb" | "default") {
  const cookieStore = await cookies();

  if (variant === "default") {
    cookieStore.delete("site-variant");
  } else {
    cookieStore.set("site-variant", variant, {
      path: "/",
      maxAge: 60 * 60 * 24 * 30, // 30 days
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
    });
  }

  revalidatePath("/");
}

export async function setTheme(theme: "light" | "dark") {
  const cookieStore = await cookies();

  cookieStore.set("theme", theme, {
    path: "/",
    maxAge: 60 * 60 * 24 * 365, // 1 year
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
  });
}
