import React from 'react';
import { useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const section = searchParams.get('section') ?? 'dashboard';

  const sectionTitleMap: Record<string, { title: string; description: string }> = {
    dashboard: {
      title: 'Dashboard',
      description: 'Overview of platform activity, performance, and highlights.',
    },
    enquiry: {
      title: 'Enquiry',
      description: 'Manage incoming enquiries and keep track of conversations.',
    },
    'company-management': {
      title: 'Company Management',
      description: 'Review companies, profiles, and account status.',
    },
    'uni-management': {
      title: 'Uni Management',
      description: 'Track universities and related operational workflows.',
    },
    'agent-management': {
      title: 'Agent Management',
      description: 'Monitor active agents, onboarding, and assignments.',
    },
    'student-management': {
      title: 'Student Management',
      description: 'See student progress, updates, and support requests.',
    },
    revenue: {
      title: 'Revenue',
      description: 'Review revenue summaries and financial trends.',
    },
    cdp: {
      title: 'CDP Training',
      description: 'Access training progress and learning resources.',
    },
    audits: {
      title: 'Audit & Compliances',
      description: 'Track audits, compliance items, and action points.',
    },
    'content-management': {
      title: 'Content Management',
      description: 'Publish and organize dashboard content and updates.',
    },
  };

  const sectionMeta = sectionTitleMap[section] ?? sectionTitleMap.dashboard;

  const stats = [
    { label: 'Total Users', value: '1,234', icon: '👥' },
    { label: 'New Enquiries', value: '128', icon: '✦' },
    { label: 'Active Agents', value: '42', icon: '●' },
    { label: 'Universities', value: '18', icon: '◼' },
    { label: 'Revenue', value: '$45.2k', icon: '↗' },
  ];

  return (
    <div className="space-y-8 text-white">
      {/* Header Card */}
      <div className="rounded-[28px] border border-white/10 bg-[#14112E] p-8 shadow-[0_20px_60px_rgba(0,0,0,0.24)]">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[#7A86B5]">
              Aega Admin Panel
            </p>
            <h2 className="mt-3 text-4xl font-semibold tracking-[-0.04em] text-white">
              {sectionMeta.title}
            </h2>
            <p className="mt-3 max-w-2xl text-white/60">
              {sectionMeta.description}
            </p>
          </div>

          <div className="rounded-2xl border border-[#F68E2D]/30 bg-[#F68E2D]/10 px-5 py-4 text-right">
            <p className="text-xs uppercase tracking-[0.35em] text-[#F6C25D]">Welcome</p>
            <p className="mt-2 text-lg font-semibold text-white">{user?.name || 'Admin User'}</p>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat, idx) => (
          <div key={idx} className="rounded-2xl border border-white/10 bg-white/5 p-6 shadow-[0_10px_30px_rgba(0,0,0,0.16)]">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#F68E2D] text-lg font-bold text-white">
              {stat.icon}
            </div>
            <p className="mt-4 text-sm font-medium text-white/55">
              {stat.label}
            </p>
            <p className="mt-2 text-3xl font-semibold text-white">
              {stat.value}
            </p>
          </div>
        ))}
      </div>

      {/* Recent Activity & Quick Actions */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1.3fr_0.7fr]">
        <div className="rounded-2xl border border-white/10 bg-[#14112E] shadow-[0_10px_30px_rgba(0,0,0,0.16)]">
          <div className="border-b border-white/10 p-6">
            <h3 className="text-xl font-semibold text-white">Recent Activity</h3>
          </div>
          <div className="divide-y divide-white/10">
            {[
              { user: 'John Doe', action: 'Posted a new article', time: '2 hours ago' },
              { user: 'Jane Smith', action: 'Updated profile information', time: '4 hours ago' },
              { user: 'Admin User', action: 'Created new user account', time: '1 day ago' },
            ].map((item, idx) => (
              <div key={idx} className="p-6 transition hover:bg-white/5">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="font-medium text-white">{item.user}</p>
                    <p className="mt-1 text-sm text-white/60">{item.action}</p>
                  </div>
                  <span className="text-xs text-white/40">{item.time}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-[#14112E] shadow-[0_10px_30px_rgba(0,0,0,0.16)]">
          <div className="border-b border-white/10 p-6">
            <h3 className="text-xl font-semibold text-white">Quick Actions</h3>
          </div>
          <div className="space-y-4 p-6">
            {[
              'Create enquiry',
              'Add company',
              'Upload content',
              'Review audit logs',
            ].map((action) => (
              <button
                key={action}
                type="button"
                className="flex w-full items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-4 text-left text-white/80 transition hover:border-[#F68E2D]/40 hover:bg-[#F68E2D]/10 hover:text-white"
              >
                <span>{action}</span>
                <span className="text-[#F6C25D]">+</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
