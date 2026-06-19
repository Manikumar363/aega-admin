import React, { useEffect, useState } from 'react';
import {
  fetchComplianceSummary,
  fetchComplianceStatus,
  fetchTargetComplaints,
  raiseTargetComplaint,
  type ComplianceSummary,
  type ComplianceStatusItem,
  type TargetComplaint
} from '../services/auditsApi';

interface CompliancesTabProps {
  targetType: 'agent' | 'company' | 'university';
  targetId: string;
}

export const CompliancesTab: React.FC<CompliancesTabProps> = ({ targetType, targetId }) => {
  const [summary, setSummary] = useState<ComplianceSummary | null>(null);
  const [complianceList, setComplianceList] = useState<ComplianceStatusItem[]>([]);
  const [complaints, setComplaints] = useState<TargetComplaint[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Modal State for raising a complaint
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [typeOfComplaint, setTypeOfComplaint] = useState('');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [modalError, setModalError] = useState<string | null>(null);

  const loadData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [sumData, listData, complaintsData] = await Promise.all([
        fetchComplianceSummary(targetType, targetId),
        fetchComplianceStatus(targetType, targetId),
        fetchTargetComplaints(targetType, targetId)
      ]);
      setSummary(sumData);
      setComplianceList(listData);
      setComplaints(complaintsData);
    } catch (err: any) {
      setError(err.message || 'Failed to load compliance details.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [targetType, targetId]);

  const handleRaiseComplaint = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!typeOfComplaint.trim() || !description.trim()) {
      setModalError('All fields are required.');
      return;
    }

    setIsSubmitting(true);
    setModalError(null);

    try {
      await raiseTargetComplaint({
        targetType,
        targetId,
        typeOfComplaint: typeOfComplaint.trim(),
        description: description.trim()
      });
      // Reset & Reload
      setTypeOfComplaint('');
      setDescription('');
      setIsModalOpen(false);
      await loadData();
    } catch (err: any) {
      setModalError(err.message || 'Failed to raise complaint.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getRiskLevelBadgeStyle = (level?: 'LOW' | 'MEDIUM' | 'HIGH') => {
    switch (level) {
      case 'HIGH':
        return 'text-red-500';
      case 'MEDIUM':
        return 'text-yellow-500';
      default:
        return 'text-green-500';
    }
  };

  const getStatusBadgeStyle = (status: 'Compliant' | 'Non-Compliant' | 'Pending') => {
    switch (status) {
      case 'Compliant':
        return 'bg-[#1B2C24] text-[#4ADE80] border-[#22C55E]/10';
      case 'Non-Compliant':
        return 'bg-[#2E1F1F] text-[#F87171] border-[#EF4444]/10';
      default:
        return 'bg-[#2B271F] text-[#FBBF24] border-[#F59E0B]/10';
    }
  };

  if (isLoading && complianceList.length === 0) {
    return (
      <div className="flex justify-center py-12 text-white">
        <svg className="animate-spin h-8 w-8 text-[#F68E2D]" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
      </div>
    );
  }

  return (
    <div className="space-y-6 text-white animate-fadeIn">
      {error && (
        <div className="bg-red-500/20 border border-red-500 text-red-200 px-4 py-3 rounded text-sm mb-4">
          {error}
        </div>
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 border border-[#2C2A45] bg-[#14112E] divide-y md:divide-y-0 md:divide-x divide-[#2C2A45]">
        {/* Active Issues */}
        <div className="flex items-center justify-between p-6">
          <div className="flex items-center gap-3">
            <svg className="w-7 h-7 text-[#F68E2D]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Active Issue</span>
          </div>
          <span className="text-2xl font-bold text-[#F68E2D]">{summary?.activeIssues ?? 0}</span>
        </div>

        {/* Overall Score */}
        <div className="flex items-center justify-between p-6">
          <div className="flex items-center gap-3">
            <svg className="w-7 h-7 text-[#F68E2D]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Over All Score</span>
          </div>
          <span className="text-2xl font-bold text-[#F68E2D]">
            {summary ? `${summary.overallScore.toFixed(2)}%` : '100.00%'}
          </span>
        </div>

        {/* Risk Level */}
        <div className="flex items-center justify-between p-6">
          <div className="flex items-center gap-3">
            <svg className="w-7 h-7 text-[#F68E2D]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Risk Level</span>
          </div>
          <span className={`text-2xl font-bold ${getRiskLevelBadgeStyle(summary?.riskLevel)}`}>
            {summary?.riskLevel ?? 'LOW'}
          </span>
        </div>
      </div>

      {/* Risk Indicator Container */}
      <div className="rounded-lg border border-[#2C2A45] bg-[#14112E] p-6">
        <h3 className="text-base font-bold uppercase tracking-wide text-white mb-6">Risk Indicator</h3>
        
        {complianceList.length === 0 ? (
          <div className="text-center py-6 text-white/50 border border-white/5 bg-[#0C0A1F] rounded-lg">
            No compliance categories defined.
          </div>
        ) : (
          <div className="divide-y divide-white/5 border border-white/5 bg-[#0C0A1F] rounded-lg">
            {complianceList.map((item) => (
              <div key={item.id} className="flex items-center justify-between px-6 py-4.5 transition-colors hover:bg-white/[0.01]">
                <span className="text-sm text-white/95 font-semibold">{item.name}</span>
                <div className={`flex items-center border px-3 py-1 rounded-full text-xs font-semibold gap-1.5 ${getStatusBadgeStyle(item.status)}`}>
                  <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
                  <span>{item.status}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Complaints List Section */}
      <div className="rounded-lg border border-[#2C2A45] bg-[#14112E] p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-base font-bold uppercase tracking-wide text-white">Complaints History ({complaints.length})</h3>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-1.5 rounded bg-[#F68E2D] hover:bg-[#e57d1f] text-white px-4.5 py-2 text-xs font-semibold transition-colors shadow"
          >
            <span className="text-sm font-bold leading-none">+</span> Raise Complaint
          </button>
        </div>

        {complaints.length === 0 ? (
          <div className="text-center py-12 text-white/50 border border-white/5 bg-[#0C0A1F] rounded-lg">
            No complaints raised against this target so far.
          </div>
        ) : (
          <div className="space-y-4">
            {complaints.map((item) => (
              <div 
                key={item._id} 
                className="bg-[#0C0A1F] border border-[#2C2A45] rounded-lg p-5 hover:border-[#F68E2D]/35 transition-all space-y-3"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="text-sm font-bold text-white tracking-wide leading-tight">
                      {item.typeOfComplaint}
                    </h4>
                    <span className="text-[11px] text-white/50">
                      Raised: {new Date(item.createdAt).toLocaleString()}
                    </span>
                  </div>
                  <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${
                    item.status === 'resolved' 
                      ? 'bg-[#1B2C24] text-[#4ADE80] border-[#22C55E]/10' 
                      : item.status === 'rejected'
                      ? 'bg-[#2E1F1F] text-[#F87171] border-[#EF4444]/10'
                      : 'bg-[#2B271F] text-[#FBBF24] border-[#F59E0B]/10'
                  }`}>
                    {item.status.toUpperCase()}
                  </span>
                </div>

                <p className="text-xs text-white/80 leading-relaxed font-medium">
                  {item.description}
                </p>

                {item.replyMessage && (
                  <div className="mt-2 p-3 bg-[#14112E] rounded border border-[#2C2A45] space-y-1">
                    <span className="text-[10px] font-bold text-[#F68E2D] uppercase tracking-wider">Admin Response:</span>
                    <p className="text-xs text-white/70 leading-relaxed">
                      {item.replyMessage}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Raise Complaint Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg rounded-xl border border-[#2C2A45] bg-[#14112E] p-6 shadow-2xl text-white animate-fadeIn">
            <div className="flex items-center justify-between border-b border-[#2C2A45] pb-3.5 mb-5">
              <h3 className="text-base font-bold uppercase tracking-wider text-[#F68E2D]">Raise New Complaint</h3>
              <button 
                type="button" 
                onClick={() => setIsModalOpen(false)}
                className="text-white/40 hover:text-white transition-colors"
              >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleRaiseComplaint} className="space-y-4">
              {modalError && (
                <div className="bg-red-500/20 border border-red-500 text-red-200 px-4 py-2.5 rounded text-xs">
                  {modalError}
                </div>
              )}

              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  Type of Complaint
                </label>
                <input
                  type="text"
                  value={typeOfComplaint}
                  onChange={(e) => setTypeOfComplaint(e.target.value)}
                  placeholder="e.g. Documentation issues, Delays, Breach of standards"
                  className="w-full border border-[#2C2A45] bg-[#0C0A1F] px-4 py-2.5 text-sm text-white placeholder:text-white/20 outline-none transition focus:border-[#F68E2D]"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  Description of issues
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Provide details about the complaint..."
                  rows={4}
                  className="w-full border border-[#2C2A45] bg-[#0C0A1F] px-4 py-3 text-sm text-white placeholder:text-white/20 outline-none transition focus:border-[#F68E2D] resize-none"
                  required
                />
              </div>

              <div className="flex justify-end gap-3 border-t border-[#2C2A45] pt-4 mt-6">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  disabled={isSubmitting}
                  className="px-4.5 py-2 rounded border border-[#2C2A45] text-xs font-semibold hover:bg-white/[0.02] transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-[#F68E2D] hover:bg-[#e57d1f] text-white px-5 py-2 rounded text-xs font-semibold transition-colors disabled:opacity-50 flex items-center gap-1.5"
                >
                  {isSubmitting && (
                    <svg className="animate-spin h-3.5 w-3.5 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                  )}
                  Submit Complaint
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CompliancesTab;
