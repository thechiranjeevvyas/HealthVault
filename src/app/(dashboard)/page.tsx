import { ShieldCheck, Users, Activity, FileText, Calendar } from "lucide-react";
import StatCard from "@/components/dashboard/StatCard";
import QuickActions from "@/components/dashboard/QuickActions";
import RecentActivity from "@/components/dashboard/RecentActivity";
import FamilyOverview from "@/components/dashboard/FamilyOverview";
import { getDashboardStats, getRecentActivity, getFamilyOverview } from "@/actions/dashboard.actions";
import { getFileSizeFormatted } from "@/lib/utils";

export default async function DashboardPage() {
  const [stats, recentActivity, familyOverview] = await Promise.all([
    getDashboardStats(),
    getRecentActivity(),
    getFamilyOverview(),
  ]);

  const hour = new Date().getHours();
  let greeting = "Good evening";
  if (hour < 12) greeting = "Good morning";
  else if (hour < 18) greeting = "Good afternoon";

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Greeting Banner */}
      <div className="bg-gradient-to-r from-vault-primary/20 to-transparent border border-vault-border rounded-xl p-6 flex items-center gap-4">
        <div className="p-3 bg-vault-primary/20 rounded-full text-vault-primary">
          <ShieldCheck className="w-8 h-8" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-vault-text">{greeting}!</h2>
          <p className="text-vault-muted text-sm mt-1">Your health vault is secure and up to date.</p>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard 
          title="Family Members" 
          value={stats.totalMembers} 
          icon={Users} 
        />
        <StatCard 
          title="Medical Events" 
          value={stats.totalEvents} 
          icon={Activity} 
        />
        <StatCard 
          title="Documents" 
          value={stats.totalDocuments} 
          subtitle={getFileSizeFormatted(stats.totalStorageUsed)}
          icon={FileText} 
        />
        <StatCard 
          title="This Month" 
          value={stats.thisMonthEvents} 
          subtitle="events logged"
          icon={Calendar} 
        />
      </div>

      {/* Quick Actions */}
      <QuickActions />

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <div className="lg:col-span-3">
          <RecentActivity events={recentActivity} />
        </div>
        <div className="lg:col-span-2">
          <FamilyOverview members={familyOverview} />
        </div>
      </div>
    </div>
  );
}
