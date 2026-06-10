import { format } from "date-fns";

export default function Header({ title, breadcrumb }: { title: string, breadcrumb?: string }) {
  const today = format(new Date(), "EEEE, MMMM d yyyy");

  return (
    <header className="h-16 bg-vault-surface border-b border-vault-border px-6 sticky top-0 z-10 flex items-center justify-between">
      {/* Left side: Title */}
      <div>
        {breadcrumb && <span className="text-vault-muted text-sm">{breadcrumb} / </span>}
        <h1 className="text-vault-text font-semibold text-xl">{title}</h1>
      </div>

      {/* Right side: Date and Avatar */}
      <div className="flex items-center gap-6">
        <div className="text-vault-muted text-sm font-medium">
          {today}
        </div>
        
        <div 
          className="w-9 h-9 rounded-full bg-vault-primary flex items-center justify-center text-white font-bold text-sm cursor-help"
          title="HealthVault Secured"
        >
          HV
        </div>
      </div>
    </header>
  );
}
