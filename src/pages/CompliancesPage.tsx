import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

type Audience = 'agent' | 'university';

interface ComplianceItem {
  id: number;
  title: string;
  description: string;
}

const agentItems: ComplianceItem[] = [
  {
    id: 1,
    title: 'INITIAL STUDENT ENGAGEMENT',
    description:
      "Covers the agent's conduct, materials, and processes from the first point of contact with a prospective student through to establishing student intent and suitability.",
  },
  {
    id: 2,
    title: 'PRE-APPLICATION: STUDENT ASSESSMENT AND ELIGIBILITY ADVICE',
    description:
      "Covers the agent's process for assessing student eligibility, academic suitability, financial capacity, and English language proficiency prior to any application being submitted.",
  },
  {
    id: 3,
    title: 'APPLICATION PREPARATION AND SUBMISSION',
    description:
      'Covers the quality and integrity of the application submitted to the institution, including document verification, accuracy of information, and compliance with institutional and UKVI requirements.',
  },
  {
    id: 4,
    title: 'OFFER MANAGEMENT AND PRE-CAS COMPLIANCE CHECKS',
    description:
      "Covers the agent's role between offer issuance and the institution's decision to issue a CAS, including managing conditions, financial evidence, and institution-side compliance triggers.",
  },
  {
    id: 5,
    title: 'CAS REQUEST AND ISSUANCE',
    description:
      'Covers checks, records, and readiness steps prior to CAS assignment and issuance by the institution.',
  },
];

const universityItems: ComplianceItem[] = [
  {
    id: 1,
    title: 'INSTITUTIONAL PARTNER DUE DILIGENCE',
    description:
      'Covers quality checks, contract terms, and governance requirements for institution and partner onboarding.',
  },
  {
    id: 2,
    title: 'APPLICATION AUDIT AND QUALITY ASSURANCE',
    description:
      'Covers internal review processes for application accuracy, evidence quality, and policy adherence.',
  },
  {
    id: 3,
    title: 'CAS GOVERNANCE AND TRACKING',
    description:
      'Covers CAS controls, issuance tracking, and ongoing monitoring requirements for institutional compliance.',
  },
];

export const CompliancesPage: React.FC = () => {
  const [audience, setAudience] = useState<Audience>('agent');
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [auditName, setAuditName] = useState('');
  const [auditDescription, setAuditDescription] = useState('');
  const navigate = useNavigate();

  const items = useMemo(() => {
    const baseItems = audience === 'agent' ? agentItems : universityItems;
    if (!searchTerm.trim()) {
      return baseItems;
    }

    const query = searchTerm.toLowerCase();
    return baseItems.filter(
      (item) =>
        item.title.toLowerCase().includes(query) ||
        item.description.toLowerCase().includes(query)
    );
  }, [audience, searchTerm]);

  return (
    <div className="space-y-4 text-white">
      <div className="flex items-center gap-8 border-b border-white/10 pb-1">
        <button
          type="button"
          onClick={() => setAudience('agent')}
          className={`pb-2 text-sm font-semibold transition ${
            audience === 'agent'
              ? 'border-b-2 border-[#F68E2D] text-[#F68E2D]'
              : 'text-white'
          }`}
        >
          Agent
        </button>
        <button
          type="button"
          onClick={() => setAudience('university')}
          className={`pb-2 text-sm font-semibold transition ${
            audience === 'university'
              ? 'border-b-2 border-[#F68E2D] text-[#F68E2D]'
              : 'text-white'
          }`}
        >
          University
        </button>
      </div>

      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h1 className="text-2xl font-bold">Compliances Management</h1>
          <p className="mt-2 text-sm text-white/70">Manage all of your CDP Training from here.</p>
        </div>

        <div className="flex w-full gap-4 lg:w-auto">
          <div className="relative flex-1 lg:w-120">
            <input
              type="text"
              placeholder="Search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full border border-white/40 bg-transparent px-4 py-3 pr-12 text-white placeholder:text-white/35 outline-none transition focus:border-[#F68E2D]"
            />
            <svg
              className="absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#263A66]"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>

          <button
            type="button"
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-2 bg-[#F68E2D] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#F68E2D]/90"
          >
            <span className="text-xl leading-none">+</span>
            Add
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {items.map((item) => (
          <section
            key={item.id}
            className="border border-[#283156] bg-[#15123A] px-8 py-7"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="max-w-[88%]">
                <h2 className="text-lg font-semibold leading-tight text-white">{item.title}</h2>
                <p className="mt-3 text-sm leading-snug text-white/90">{item.description}</p>
              </div>

              <div className="mt-1 flex items-center gap-3">
                <button
                  type="button"
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-[#3B53D7] text-white transition hover:bg-[#2f45bf]"
                  title="Edit"
                >
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5M16.5 3.5a2.121 2.121 0 013 3L12 14l-4 1 1-4 7.5-7.5z"
                    />
                  </svg>
                </button>
                <button
                  type="button"
                  onClick={() => navigate(`/compliances/view/${item.id}`)}
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-[#B4752A] text-white transition hover:bg-[#9c6322]"
                  title="Expand"
                >
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2.2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </section>
        ))}
      </div>

      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="w-full max-w-3xl rounded-lg border border-white/10 bg-[#15123A] text-white shadow-[0_30px_90px_rgba(0,0,0,0.45)]">
            <div className="p-8 lg:p-10">
              <h2 className="text-2xl font-semibold tracking-[-0.03em]">Add Agent Audit</h2>

              <div className="mt-7 space-y-8">
                <div>
                  <label className="mb-4 block text-lg font-medium">
                    Audit Name <span className="text-[#F68E2D]">*</span>
                  </label>
                  <input
                    type="text"
                    value={auditName}
                    onChange={(e) => setAuditName(e.target.value)}
                    placeholder="Audit Name"
                    className="w-full border border-white/20 bg-transparent px-5 py-4 text-lg text-white placeholder:text-white/40 outline-none transition focus:border-[#F68E2D]"
                  />
                </div>

                <div>
                  <label className="mb-4 block text-lg font-medium">
                    Description <span className="text-[#F68E2D]">*</span>
                  </label>
                  <textarea
                    value={auditDescription}
                    onChange={(e) => setAuditDescription(e.target.value)}
                    placeholder="Description"
                    rows={6}
                    className="w-full border border-white/20 bg-transparent px-5 py-4 text-lg text-white placeholder:text-white/40 outline-none transition focus:border-[#F68E2D] resize-none"
                  />
                </div>
              </div>

              <div className="mt-12 flex flex-col gap-4 sm:flex-row sm:justify-center">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="min-w-45 border border-[#F68E2D] bg-white px-6 py-4 text-lg font-medium text-[#B8BDC7] transition hover:bg-white/95"
                >
                  Discard
                </button>
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="min-w-45 bg-[#F68E2D] px-6 py-4 text-lg font-semibold text-white transition hover:bg-[#F68E2D]/90"
                >
                  Add
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CompliancesPage;
