import Link from "next/link";
import { lockVault } from "@/actions/auth.actions";
import { Lock } from "lucide-react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="w-64 border-r bg-muted/30 flex flex-col p-4">
        <div className="font-bold text-xl mb-8">HealthVault</div>
        <nav className="flex flex-col gap-2 flex-1">
          <Link href="/" className="hover:underline">Dashboard</Link>
          <Link href="/members" className="hover:underline">Members</Link>
          <Link href="/timeline" className="hover:underline">Timeline</Link>
          <Link href="/documents" className="hover:underline">Documents</Link>
          <Link href="/search" className="hover:underline">Search</Link>
          <Link href="/backup" className="hover:underline">Backup</Link>
          <Link href="/settings" className="hover:underline">Settings</Link>
        </nav>
        
        {/* Footer */}
        <div className="pt-4 border-t mt-auto">
          <form action={lockVault}>
            <button 
              type="submit" 
              className="flex items-center gap-2 text-sm text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors w-full text-left"
            >
              <Lock className="w-4 h-4" />
              Lock Vault
            </button>
          </form>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-6">
        {children}
      </main>
    </div>
  );
}
