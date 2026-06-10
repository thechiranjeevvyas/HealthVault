"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Shield, LayoutDashboard, Users, Activity, FileText, Search, Settings, Lock } from "lucide-react";
import { lockVault } from "@/actions/auth.actions";

const NAV_LINKS = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/members", label: "Family Members", icon: Users },
  { href: "/timeline", label: "Timeline", icon: Activity },
  { href: "/documents", label: "Documents", icon: FileText },
  { href: "/search", label: "Search", icon: Search },
  { href: "/backup", label: "Backup", icon: Shield },
  { href: "/settings", label: "Settings", icon: Settings },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-[240px] h-screen bg-vault-surface border-r border-vault-border flex flex-col fixed left-0 top-0">
      {/* Logo Area */}
      <div className="p-6 border-b border-vault-border">
        <div className="flex items-center gap-3">
          <Shield className="w-8 h-8 text-vault-primary" />
          <div>
            <h1 className="text-white font-semibold text-lg leading-tight">HealthVault</h1>
            <p className="text-vault-muted text-xs">Family Health Records</p>
          </div>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 py-4 flex flex-col">
        {NAV_LINKS.map((link) => {
          const isActive = pathname === link.href;
          const Icon = link.icon;
          
          return (
            <Link 
              key={link.href} 
              href={link.href}
              className={`flex items-center gap-3 px-6 py-3 relative transition-colors ${
                isActive 
                  ? "text-vault-primary bg-white/5" 
                  : "text-vault-muted hover:bg-white/5 hover:text-white"
              }`}
            >
              {isActive && (
                <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-vault-primary" />
              )}
              <Icon className="w-5 h-5" />
              <span className="font-medium text-sm">{link.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Lock Button */}
      <div className="p-4 border-t border-vault-border">
        <form action={lockVault}>
          <button 
            type="submit"
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium text-vault-muted hover:text-vault-danger hover:bg-vault-danger/10 rounded-md transition-colors"
          >
            <Lock className="w-4 h-4" />
            Lock Vault
          </button>
        </form>
      </div>
    </aside>
  );
}
