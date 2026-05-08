import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  DashboardIcon,
  StudentManagementIcon,
  AgentManagementIcon,
  UniManagementIcon,
  OfficeIcon,
  RevenueIcon,
  CDPIcon,
  ComplianceIcon,
  ContentManagementIcon,
  EnquiryIcon
} from '../ui/icons';

type IconComponent = React.ComponentType<React.SVGProps<SVGSVGElement>>;

interface NavItem {
  label: string;
  path: string;
  icon: IconComponent;
}

const navItems: NavItem[] = [
  { label: 'Dashboard', path: '/dashboard', icon: DashboardIcon },
  {label: 'Enquiry', path: '/enquiries', icon:EnquiryIcon},
   { label: 'Company Management', path: '/office', icon: OfficeIcon },
  { label: 'University Management', path: '/universities', icon: UniManagementIcon },
  { label: 'Agent Management', path: '/agents', icon: AgentManagementIcon },
  { label: 'Student Management', path: '/students', icon: StudentManagementIcon },
  { label: 'Revenue', path: '/revenue', icon: RevenueIcon },
  { label: 'CDP Training', path: '/cdp', icon: CDPIcon },
  { label: 'Audits & Compliances', path: '/compliances', icon: ComplianceIcon },
  {label: 'Content Management', path: '/content', icon: ContentManagementIcon},
];


export const Sidebar: React.FC = () => {
  const location = useLocation();

  return (
    <aside className="w-64 bg-[#14112E] text-white flex flex-col fixed top-0 left-0 h-screen z-20 overflow-y-auto">
      {/* Logo */}
      <div className="p-3 flex items-start justify-start">
        <Link to="/dashboard">
          <img
            src="/logo1.png"
            alt="AEGA Logo"
            className="w-50 h-auto ml-2 brightness-140 contrast-125"
          />
        </Link>
      </div>

      {/* Navigation */}
      <nav className="px-4 mt-3 flex-1">
        <ul className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={`flex items-center gap-2 px-3 py-2 rounded transition-colors ${
                    isActive
                      ? 'bg-[#F68E2D] text-white'
                      : 'text-white/80 hover:bg-[#F68E2D] hover:text-white'
                  }`}
                >
                  <span className="w-6 h-6 flex items-center justify-center">
                    <Icon />
                  </span>
                  <span className="text-sm">{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Footer spacer */}
      <div className="px-4 pb-4"></div>
    </aside>
  );
};

export default Sidebar;
