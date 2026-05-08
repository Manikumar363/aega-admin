import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { DeleteIcon, EditIcon } from '../components/ui/icons';

interface Criterion {
  id: number;
  criterion: string;
  evidence: string;
}

const sampleCriteria: Criterion[] = [
  { id: 1, criterion: 'Agent identifies themselves clearly as an authorized recruitment agent, not as a representative of the institution', evidence: 'Scripts / Greeting Templates, Student testimonial' },
  { id: 2, criterion: 'Marketing material used are approved by the institution and current in out-of-date fee data', evidence: 'Sample materials with version / date, approval email from institution' },
  { id: 3, criterion: 'A student enquiry record is created in the CRM at first contact', evidence: 'Scripts / FAQ document. Mystery shopper document if available.' },
];

export const ComplianceViewPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [criteria, setCriteria] = useState<Criterion[]>(sampleCriteria);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [newCriterion, setNewCriterion] = useState('');
  const [newEvidence, setNewEvidence] = useState('');

  const handleAddOpen = () => setIsAddOpen(true);
  const handleAddClose = () => {
    setIsAddOpen(false);
    setNewCriterion('');
    setNewEvidence('');
  };

  const handleAdd = () => {
    const title = newCriterion.trim();
    const evidence = newEvidence.trim();
    if (!title) return;
    const nextId = criteria.length ? Math.max(...criteria.map((c) => c.id)) + 1 : 1;
    setCriteria((prev) => [...prev, { id: nextId, criterion: title, evidence }]);
    handleAddClose();
  };

  return (
    <div className="space-y-6 text-white">
      <div className="flex items-center justify-between">
        <div>
          <button
            onClick={() => navigate('/compliances')}
            className="mb-4 text-white/60 hover:text-white transition flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back
          </button>

          <h1 className="text-3xl font-bold">View Audit</h1>
          <p className="mt-2 text-white/60">Viewing audit details for id: {id}</p>
        </div>
        <div>
          <button onClick={handleAddOpen} className="bg-[#F68E2D] px-4 py-2 rounded text-white">+ Add</button>
        </div>
      </div>

      <div className="rounded-lg border border-white/10 bg-[#15123A] p-6">
        <h2 className="text-xl font-semibold mb-4">Initial Student Engagement</h2>
        <p className="text-white/70 mb-6">Covers the agent's conduct, materials, and processes from the first point of contact with a prospective student through to establishing student intent and suitability.</p>

        <div className="overflow-x-auto">
          <table className="w-full table-fixed border-collapse">
            <thead>
              <tr className="bg-[#0D0B1A]">
                <th className="px-4 py-3 text-left text-sm text-white/80 w-16">Sl No.</th>
                <th className="px-4 py-3 text-left text-sm text-white/80 w-1/2">Audit Criterion</th>
                <th className="px-4 py-3 text-left text-sm text-white/80 w-1/3">Evidence Required</th>
                <th className="px-4 py-3 text-left text-sm text-white/80 w-32">Action</th>
              </tr>
            </thead>
            <tbody>
              {criteria.map((c) => (
                <tr key={c.id} className="border-b border-white/10">
                  <td className="px-4 py-4 text-sm align-top">{c.id}</td>
                  <td className="px-4 py-4 text-sm align-top">{c.criterion}</td>
                  <td className="px-4 py-4 text-sm align-top">{c.evidence}</td>
                  <td className="px-4 py-4 text-sm align-top">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        title="Edit"
                        aria-label="Edit criterion"
                        className="h-8 w-8 rounded-md flex items-center justify-center bg-[#3B53D7] text-white hover:opacity-95"
                      >
                        <EditIcon />
                      </button>
                      <button
                        title="Delete"
                        aria-label="Delete criterion"
                        className="h-8 w-8 rounded-md flex items-center justify-center bg-red-500 text-white hover:opacity-95"
                      >
                        <DeleteIcon />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {isAddOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
            <div className="w-full max-w-4xl rounded-lg border border-white/10 bg-[#0F0C23] text-white">
              <div className="p-8">
                <h2 className="text-2xl font-semibold mb-6">Add Audit Criterion</h2>

                <div className="space-y-6">
                  <div>
                    <label className="block mb-2 text-sm font-medium">Audit Criterion <span className="text-[#F68E2D]">*</span></label>
                    <textarea
                      value={newCriterion}
                      onChange={(e) => setNewCriterion(e.target.value)}
                      placeholder="Audit Criterion"
                      rows={3}
                      className="w-full border border-white/10 bg-transparent px-4 py-3 text-sm text-white placeholder:text-white/40 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block mb-2 text-sm font-medium">Evidence <span className="text-[#F68E2D]">*</span></label>
                    <textarea
                      value={newEvidence}
                      onChange={(e) => setNewEvidence(e.target.value)}
                      placeholder="Evidence"
                      rows={3}
                      className="w-full border border-white/10 bg-transparent px-4 py-3 text-sm text-white placeholder:text-white/40 outline-none"
                    />
                  </div>
                </div>

                <div className="mt-8 flex justify-center gap-6">
                  <button
                    onClick={handleAddClose}
                    className="min-w-45 border border-[#F68E2D] bg-white px-6 py-3 text-sm font-medium text-[#B8BDC7]"
                  >
                    Discard
                  </button>
                  <button
                    onClick={handleAdd}
                    className="min-w-45 bg-[#F68E2D] px-6 py-3 text-sm font-semibold text-white"
                  >
                    Add
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ComplianceViewPage;
