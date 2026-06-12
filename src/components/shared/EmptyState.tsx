import Link from "next/link";
import { LucideIcon } from "lucide-react";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: {
    label: string;
    href?: string;
    onClick?: () => void;
  };
}

export default function EmptyState({ icon: Icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center text-center h-full min-h-[200px] p-6">
      <div className="w-16 h-16 rounded-full bg-vault-bg flex items-center justify-center mb-4 border border-vault-border">
        <Icon className="w-8 h-8 text-vault-muted" />
      </div>
      <h3 className="text-lg font-medium text-vault-text mb-1">{title}</h3>
      <p className="text-sm text-vault-muted max-w-xs mb-6">
        {description}
      </p>
      
      {action && (
        action.href ? (
          <Link 
            href={action.href}
            className="bg-vault-primary hover:bg-vault-primary/90 text-white text-sm font-medium py-2 px-4 rounded-md transition-colors"
          >
            {action.label}
          </Link>
        ) : (
          <button
            onClick={action.onClick}
            className="bg-vault-primary hover:bg-vault-primary/90 text-white text-sm font-medium py-2 px-4 rounded-md transition-colors"
          >
            {action.label}
          </button>
        )
      )}
    </div>
  );
}
