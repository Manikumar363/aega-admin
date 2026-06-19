import React, { useState } from 'react';
import CDPTraining from '../CDPTraining';
import Compliances from '../CompliancesTab';
import Audits from '../AuditsTab';

type Company = {
  id: number;
  name: string;
  designation: string;
  mobile: string;
  email: string;
  location: string;
  avatar: string;
  verified: 'blue' | 'orange' | 'red';
  online: boolean;
};

type ViewCompanyProps = {
  company: Company;
  onClose?: () => void;
};

const performance = [
  { label: 'Visa refusal (85% - 100%)', value: 75, max: 75, color: '#F68E2D' },
  { label: 'Enrollment (50% - 84%)', value: 24, max: 75, color: '#2563eb' },
  { label: 'withdrawn Student (0% - 49%)', value: 1, max: 75, color: '#F68E2D' },
  { label: 'Withdrawn Payment (50% - 79%)', value: 40, max: 75, color: '#F68E2D' },
  { label: 'Academic Withdrawn (80% - 100%)', value: 75, max: 75, color: '#F68E2D' },
  { label: 'Student Output Sucess(80% - 100%)', value: 50, max: 75, color: '#10b981' },
  { label: 'Student Output Needs Improvement (60% - 79%)', value: 40, max: 75, color: '#10b981' },
  { label: 'Student Output Unsatisfactory( Below 60%)', value: 30, max: 75, color: '#10b981' },
];

const ViewCompany: React.FC<ViewCompanyProps> = ({ company }) => {
  const [timePeriod, setTimePeriod] = useState<'weekly' | 'monthly' | 'yearly'>('weekly');
  const [activeTab, setActiveTab] = useState<'info' | 'cdp' | 'compliances' | 'audits' | 'agent'>('info');
  const [isEditingAudit, setIsEditingAudit] = useState(false);

  const handleTabChange = (tab: typeof activeTab) => {
    setActiveTab(tab);
    setIsEditingAudit(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between border-b border-[#F68E2D] pb-2 mb-6">
        <div className="flex items-center gap-8">
          <button onClick={() => handleTabChange('info')} className={`font-semibold pb-2 border-b-2 ${activeTab === 'info' ? 'text-[#F68E2D] border-[#F68E2D]' : 'text-white border-transparent'}`}>Info</button>
          <button onClick={() => handleTabChange('cdp')} className={`font-semibold pb-2 border-b-2 ${activeTab === 'cdp' ? 'text-[#F68E2D] border-[#F68E2D]' : 'text-white border-transparent'}`}>CDP Training</button>
          <button onClick={() => handleTabChange('compliances')} className={`font-semibold pb-2 border-b-2 ${activeTab === 'compliances' ? 'text-[#F68E2D] border-[#F68E2D]' : 'text-white border-transparent'}`}>Compliances</button>
          <button onClick={() => handleTabChange('audits')} className={`font-semibold pb-2 border-b-2 ${activeTab === 'audits' ? 'text-[#F68E2D] border-[#F68E2D]' : 'text-white border-transparent'}`}>Audits</button>
          <button onClick={() => handleTabChange('agent')} className={`font-semibold pb-2 border-b-2 ${activeTab === 'agent' ? 'text-[#F68E2D] border-[#F68E2D]' : 'text-white border-transparent'}`}>Agents</button>
        </div>

        <div className="flex items-center gap-3">
          {activeTab === 'audits' && (
            <button onClick={() => setIsEditingAudit(!isEditingAudit)} className="flex items-center gap-2 rounded bg-[#F68E2D] px-5 py-2 font-semibold text-white transition-colors hover:bg-[#e57d1f]">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5M16.5 3.5a2.121 2.121 0 013 3L12 14l-4 1 1-4 7.5-7.5z" />
              </svg>
              {isEditingAudit ? 'Back to Audits' : 'Edit'}
            </button>
          )}
          <button className="bg-[#F68E2D] hover:bg-[#e57d1f] text-white px-6 py-2 rounded font-medium flex items-center gap-2"> <span className="text-lg font-bold">+</span> Raise Complaint</button>
        </div>
      </div>

      {activeTab === 'cdp' ? (
        <CDPTraining />
      ) : activeTab === 'compliances' ? (
        <Compliances targetType="company" targetId={String(company.id)} />
      ) : activeTab === 'audits' ? (
        <Audits targetType="company" targetId={String(company.id)} isEditing={isEditingAudit} onCancel={() => setIsEditingAudit(false)} />
      ) : activeTab === 'agent' ? (
        <div>Agents</div>
      ) : (
        <>
          <div className="bg-[#14112E] rounded-lg p-6 border border-[#2C2A45]">
            <h2 className="text-white text-lg font-semibold mb-4">AGENT INFORMATION</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-white text-sm">
              <div>
                <div className="mb-3">
                  <span className="font-semibold text-gray-400">First Name :</span>
                  <span className="ml-2">{company.name}</span>
                </div>
                <div>
                  <span className="font-semibold text-gray-400">Email ID :</span>
                  <span className="ml-2">{company.email}</span>
                </div>
              </div>
              <div>
                <div className="mb-3">
                  <span className="font-semibold text-gray-400">Last Name :</span>
                  <span className="ml-2">Decker</span>
                </div>
                <div>
                  <span className="font-semibold text-gray-400">Phone Number :</span>
                  <span className="ml-2">{company.mobile}</span>
                </div>
              </div>
              <div>
                <div className="mb-3">
                  <span className="font-semibold text-gray-400">Designation :</span>
                  <span className="ml-2">{company.designation}</span>
                </div>
              </div>
              <div>
                <div className="mb-3">
                  <span className="font-semibold text-gray-400">Office :</span>
                  <span className="ml-2">{company.location}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-[#14112E] rounded-lg p-6 border border-[#2C2A45]">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-white text-lg font-semibold">PERFORMANCE MATRIX</h2>
              <div className="flex gap-2">
                {(['weekly', 'monthly', 'yearly'] as const).map((period) => (
                  <button key={period} onClick={() => setTimePeriod(period)} className={`px-4 py-2 rounded text-sm font-medium ${timePeriod === period ? 'bg-[#F68E2D] text-white' : 'bg-transparent text-white/70 hover:text-white border border-white/20'}`}>
                    {period.charAt(0).toUpperCase() + period.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              {performance.map((item, idx) => (
                <div key={idx}>
                  <div className="flex justify-between text-white text-sm mb-2">
                    <span>{item.label}</span>
                    <span className="font-semibold">{String(item.value).padStart(2, '0')}/{item.max}</span>
                  </div>
                  <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden">
                    <div className="h-2 rounded-full transition-all duration-300" style={{ width: `${(item.value / item.max) * 100}%`, backgroundColor: item.color }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ViewCompany;
