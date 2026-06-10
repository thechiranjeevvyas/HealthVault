import Link from "next/link";
import { UserPlus, PlusCircle, Upload, Search } from "lucide-react";

const ACTIONS = [
  { label: "Add Member", icon: UserPlus, href: "/members?action=new" },
  { label: "Log Event", icon: PlusCircle, href: "/timeline?action=new" },
  { label: "Upload Document", icon: Upload, href: "/documents?action=new" },
  { label: "Search Records", icon: Search, href: "/search" },
];

export default function QuickActions() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {ACTIONS.map((action) => {
        const Icon = action.icon;
        return (
          <Link
            key={action.label}
            href={action.href}
            className="bg-vault-surface border border-vault-border rounded-xl p-4 flex flex-col items-center justify-center gap-3 text-vault-text hover:border-vault-primary hover:text-vault-primary transition-all group"
          >
            <div className="p-3 rounded-full bg-vault-bg group-hover:bg-vault-primary/10 transition-colors">
              <Icon className="w-6 h-6" />
            </div>
            <span className="text-sm font-medium">{action.label}</span>
          </Link>
        );
      })}
    </div>
  );
}
