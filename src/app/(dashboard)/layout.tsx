import Link from "next/link";

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
        <nav className="flex flex-col gap-2">
          <Link href="/" className="hover:underline">Dashboard</Link>
          <Link href="/members" className="hover:underline">Members</Link>
          <Link href="/timeline" className="hover:underline">Timeline</Link>
          <Link href="/documents" className="hover:underline">Documents</Link>
          <Link href="/search" className="hover:underline">Search</Link>
          <Link href="/backup" className="hover:underline">Backup</Link>
          <Link href="/settings" className="hover:underline">Settings</Link>
        </nav>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-6">
        {children}
      </main>
    </div>
  );
}
