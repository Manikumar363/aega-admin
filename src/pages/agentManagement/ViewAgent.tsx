import React, { useState } from 'react';
import CDPTraining from '../CDPTraining';
import Compliances from '../CompliancesPage';
import Audits from '../CompliancesPage';
import type { Agent } from './mockData';

type ViewAgentProps = {
  agent: Agent;
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

const ViewAgent: React.FC<ViewAgentProps> = ({ agent }) => {
  const [timePeriod, setTimePeriod] = useState<'weekly' | 'monthly' | 'yearly'>('weekly');
  const [activeTab, setActiveTab] = useState<'info' | 'cdp' | 'compliances' | 'audits'>('info');

  return (
    <div className="space-y-6">
      <div className="mb-6 flex items-center justify-between border-b border-[#F68E2D] pb-2">
        <div className="flex items-center gap-8">
          <button onClick={() => setActiveTab('info')} className={`border-b-2 pb-2 font-semibold ${activeTab === 'info' ? 'border-[#F68E2D] text-[#F68E2D]' : 'border-transparent text-white'}`}>
            Info
          </button>
          <button onClick={() => setActiveTab('cdp')} className={`border-b-2 pb-2 font-semibold ${activeTab === 'cdp' ? 'border-[#F68E2D] text-[#F68E2D]' : 'border-transparent text-white'}`}>
            CDP Training
          </button>
          <button onClick={() => setActiveTab('compliances')} className={`border-b-2 pb-2 font-semibold ${activeTab === 'compliances' ? 'border-[#F68E2D] text-[#F68E2D]' : 'border-transparent text-white'}`}>
            Compliances
          </button>
          <button onClick={() => setActiveTab('audits')} className={`border-b-2 pb-2 font-semibold ${activeTab === 'audits' ? 'border-[#F68E2D] text-[#F68E2D]' : 'border-transparent text-white'}`}>
            Audits
          </button>
        </div>

        <button className="flex items-center gap-2 rounded bg-[#F68E2D] px-6 py-2 font-medium text-white transition-colors hover:bg-[#e57d1f]">
          <span className="text-lg font-bold">+</span> Raise Complaint
        </button>
      </div>

      {activeTab === 'cdp' ? (
        <CDPTraining />
      ) : activeTab === 'compliances' ? (
        <Compliances />
      ) : activeTab === 'audits' ? (
        <Audits />
      ) : (
        <>
          <div className="rounded-lg border border-[#2C2A45] bg-[#14112E] p-6">
            <h2 className="mb-4 text-lg font-semibold text-white">AGENT INFORMATION</h2>
            <div className="grid grid-cols-1 gap-6 text-sm text-white md:grid-cols-2">
              <div>
                <div className="mb-3">
                  <span className="font-semibold text-gray-400">First Name :</span>
                  <span className="ml-2">{agent.name}</span>
                </div>
                <div>
                  <span className="font-semibold text-gray-400">Email ID :</span>
                  <span className="ml-2">{agent.email}</span>
                </div>
              </div>
              <div>
                <div className="mb-3">
                  <span className="font-semibold text-gray-400">Last Name :</span>
                  <span className="ml-2">Decker</span>
                </div>
                <div>
                  <span className="font-semibold text-gray-400">Phone Number :</span>
                  <span className="ml-2">{agent.mobile}</span>
                </div>
              </div>
              <div>
                <div className="mb-3">
                  <span className="font-semibold text-gray-400">Designation :</span>
                  <span className="ml-2">{agent.designation}</span>
                </div>
              </div>
              <div>
                <div className="mb-3">
                  <span className="font-semibold text-gray-400">Office :</span>
                  <span className="ml-2">{agent.location}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-lg border border-[#2C2A45] bg-[#14112E] p-6">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-white">PERFORMANCE MATRIX</h2>
              <div className="flex gap-2">
                {(['weekly', 'monthly', 'yearly'] as const).map((period) => (
                  <button
                    key={period}
                    onClick={() => setTimePeriod(period)}
                    className={`rounded px-4 py-2 text-sm font-medium transition-colors ${
                      timePeriod === period
                        ? 'bg-[#F68E2D] text-white'
                        : 'border border-white/20 bg-transparent text-white/70 hover:text-white'
                    }`}
                  >
                    {period.charAt(0).toUpperCase() + period.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              {performance.map((item, idx) => (
                <div key={idx}>
                  <div className="mb-2 flex justify-between text-sm text-white">
                    <span>{item.label}</span>
                    <span className="font-semibold">{String(item.value).padStart(2, '0')}/{item.max}</span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-gray-700">
                    <div className="h-2 rounded-full" style={{ width: `${(item.value / item.max) * 100}%`, backgroundColor: item.color }} />
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

export default ViewAgent;
