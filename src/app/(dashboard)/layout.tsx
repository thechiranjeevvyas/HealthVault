"use client";

import { usePathname } from "next/navigation";
import Sidebar from "@/components/layout/Sidebar";
import Header from "@/components/layout/Header";

const ROUTE_MAP: Record<string, string> = {
  "/": "Dashboard",
  "/members": "Family Members",
  "/timeline": "Timeline",
  "/documents": "Documents",
  "/search": "Search",
  "/backup": "Backup & Restore",
  "/settings": "Settings",
};

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const title = ROUTE_MAP[pathname] || "Dashboard";

  return (
    <div className="flex h-screen overflow-hidden bg-vault-bg">
      <Sidebar />
      <div className="flex-1 flex flex-col ml-[240px]">
        <Header title={title} />
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
