import { DashboardSidebar } from "@/components/DashboardSidebar";
import { auth } from "@/auth";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  return (
    <div className="flex h-screen bg-gray-950">
      <DashboardSidebar user={session?.user} />
      <main className="flex-1 overflow-auto bg-gray-950 p-8">
        <div className="mx-auto max-w-6xl">{children}</div>
      </main>
    </div>
  );
}

