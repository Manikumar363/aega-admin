import React, { useEffect, useState } from 'react';
import {
  fetchAuditCategories,
  fetchAuditChecks,
  fetchAuditCheckSummary,
  submitAuditCheck,
  type AuditCategory,
  type AuditCheck,
  type AuditCheckSummary,
  type AuditAnswer
} from '../services/auditsApi';

interface AuditsTabProps {
  targetType: 'agent' | 'company' | 'university';
  targetId: string;
  isEditing?: boolean;
  onCancel?: () => void;
}

export const AuditsTab: React.FC<AuditsTabProps> = ({
  targetType,
  targetId,
  isEditing = false,
  onCancel
}) => {
  // Summary and check list state
  const [summary, setSummary] = useState<AuditCheckSummary | null>(null);
  const [completedChecks, setCompletedChecks] = useState<AuditCheck[]>([]);
  const [categories, setCategories] = useState<AuditCategory[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Evaluation states
  const [expandedCategoryId, setExpandedCategoryId] = useState<string | null>(null);
  const [evaluationAnswers, setEvaluationAnswers] = useState<
    Record<
      string,
      {
        status: 'compliant' | 'non-compliant';
        rating: 'Low' | 'Medium' | 'High';
        comment: string;
      }
    >
  >({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState<string | null>(null);

  // Load all audits and summary on mount
  const loadData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [sumData, checksData, catsData] = await Promise.all([
        fetchAuditCheckSummary(targetType, targetId),
        fetchAuditChecks(targetType, targetId),
        // Since backend templates categorize by target 'agent' and 'university',
        // companies share the 'agent' templates.
        fetchAuditCategories(targetType === 'university' ? 'university' : 'agent')
      ]);
      setSummary(sumData);
      setCompletedChecks(checksData);
      setCategories(catsData);
    } catch (err: any) {
      setError(err.message || 'Failed to load compliance audit data.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [targetType, targetId]);

  const toggleCategory = (categoryId: string) => {
    setSubmitError(null);
    setSubmitSuccess(null);
    if (expandedCategoryId === categoryId) {
      setExpandedCategoryId(null);
    } else {
      setExpandedCategoryId(categoryId);
      // Initialize answers for this category if not already initialized
      const category = categories.find((c) => c._id === categoryId);
      if (category && category.criteria) {
        const nextAnswers = { ...evaluationAnswers };
        const latestCheck = completedChecks.find((c) => c.categoryId === categoryId);

        category.criteria.forEach((crit) => {
          if (crit._id && !nextAnswers[crit._id]) {
            // Pre-fill with previous answers if they exist
            const prevAns = latestCheck?.answers?.find((a) => a.criterionId === crit._id);

            if (prevAns) {
              const rating: 'Low' | 'Medium' | 'High' =
                prevAns.severity === 'high' ? 'High' : prevAns.severity === 'medium' ? 'Medium' : 'Low';

              nextAnswers[crit._id] = {
                status: prevAns.status || (rating === 'Low' ? 'compliant' : 'non-compliant'),
                rating,
                comment: prevAns.comment || ''
              };
            } else {
              // Fallback to template default
              const severity = crit.severity || 'low';
              const rating: 'Low' | 'Medium' | 'High' =
                severity === 'high' ? 'High' : severity === 'medium' ? 'Medium' : 'Low';

              nextAnswers[crit._id] = {
                status: rating === 'Low' ? 'compliant' : 'non-compliant',
                rating,
                comment: ''
              };
            }
          }
        });
        setEvaluationAnswers(nextAnswers);
      }
    }
  };

  const handleRatingChange = (criterionId: string, rating: 'Low' | 'Medium' | 'High') => {
    setEvaluationAnswers((prev) => ({
      ...prev,
      [criterionId]: {
        ...prev[criterionId],
        rating,
        status: rating === 'Low' ? 'compliant' : 'non-compliant'
      }
    }));
  };

  const handleCommentChange = (criterionId: string, comment: string) => {
    setEvaluationAnswers((prev) => ({
      ...prev,
      [criterionId]: {
        ...prev[criterionId],
        comment
      }
    }));
  };

  // Real-time compliance score calculation helper for active form UI
  const getLiveCategoryScore = (category: AuditCategory) => {
    if (!category.criteria || category.criteria.length === 0) return '100.00%';

    let sumScores = 0;
    let count = 0;

    category.criteria.forEach((crit) => {
      if (!crit._id) return;
      const ans = evaluationAnswers[crit._id];
      const rating = ans ? ans.rating : 'Low';

      const levelScore = rating === 'High' ? 33.33 : rating === 'Medium' ? 66.66 : 100;
      sumScores += levelScore;
      count += 1;
    });

    if (count === 0) return '100.00%';
    const score = sumScores / count;
    return `${score.toFixed(2)}%`;
  };

  // Get the display score for category headers (pre-fills with latest completed check score if not initialized)
  const getCategoryHeaderScore = (category: AuditCategory) => {
    const hasInitialized = category.criteria?.some((crit) => crit._id && evaluationAnswers[crit._id]);

    if (hasInitialized) {
      return getLiveCategoryScore(category);
    }

    const latestCheck = completedChecks.find((c) => c.categoryId === category._id);
    if (latestCheck) {
      return `${latestCheck.complianceScore.toFixed(2)}%`;
    }

    return '100.00%';
  };

  const handleSaveEvaluation = async (category: AuditCategory) => {
    if (!category._id || !category.criteria) return;
    setIsSubmitting(true);
    setSubmitError(null);
    setSubmitSuccess(null);

    try {
      const answers: AuditAnswer[] = category.criteria.map((crit) => {
        if (!crit._id) throw new Error('Criterion template ID missing.');
        const ans = evaluationAnswers[crit._id];
        const rating = ans?.rating || 'Low';
        return {
          criterionId: crit._id,
          status: rating === 'Low' ? 'compliant' : 'non-compliant',
          severity: rating.toLowerCase() as 'low' | 'medium' | 'high',
          comment: ans?.comment || ''
        };
      });

      await submitAuditCheck({
        targetType,
        targetId,
        categoryId: category._id,
        answers
      });

      setSubmitSuccess(`Successfully saved audit check for "${category.name}".`);
      setExpandedCategoryId(null);
      // Reload overall state
      await loadData();
      if (onCancel) {
        onCancel();
      }
    } catch (err: any) {
      setSubmitError(err.message || 'Failed to save audit check.');
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

  if (isLoading && completedChecks.length === 0) {
    return (
      <div className="flex justify-center py-12 text-white">
        <svg className="animate-spin h-8 w-8 text-[#F68E2D]" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
      </div>
    );
  }

  if (isEditing) {
    return (
      <div className="space-y-6 text-white animate-fadeIn">
        <div className="relative border-b-2 border-[#F68E2D] pb-1 w-fit">
          <span className="text-base font-semibold text-[#F68E2D]">Edit Compliance Audit</span>
        </div>

        {submitError && (
          <div className="bg-red-500/20 border border-red-500 text-red-200 px-4 py-3 rounded text-sm">
            {submitError}
          </div>
        )}

        {submitSuccess && (
          <div className="bg-green-500/20 border border-green-500 text-green-200 px-4 py-3 rounded text-sm">
            {submitSuccess}
          </div>
        )}

        {categories.length === 0 ? (
          <div className="text-center py-12 text-white/50 border border-[#2C2A45] bg-[#14112E] rounded">
            No audit category templates found. Create categories in Compliances Management first.
          </div>
        ) : (
          <div className="space-y-4">
            {categories.map((category) => {
              if (!category._id) return null;
              const isExpanded = expandedCategoryId === category._id;
              const headerScore = getCategoryHeaderScore(category);

              return (
                <div
                  key={category._id}
                  className="rounded-lg border border-[#2C2A45] bg-[#14112E] overflow-hidden"
                >
                  {/* Category Header */}
                  <button
                    type="button"
                    onClick={() => toggleCategory(category._id!)}
                    className="w-full flex items-center justify-between px-6 py-5 hover:bg-white/[0.02] transition-colors text-left"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-base font-bold tracking-wide uppercase">
                        {category.name}
                      </span>
                      <span className="text-gray-400 font-bold">•</span>
                      <span className="text-base font-bold text-[#F68E2D]">{headerScore}</span>
                    </div>
                    <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#F68E2D]/15 text-[#F68E2D]">
                      <svg
                        className={`h-4 w-4 transform transition-transform duration-200 ${
                          isExpanded ? 'rotate-180' : 'rotate-0'
                        }`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2.5}
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </div>
                  </button>

                  {/* Criteria Evaluator Content */}
                  {isExpanded && (
                    <div className="p-6 border-t border-[#2C2A45] bg-[#0C0A1F] space-y-6 animate-fadeIn">
                      {category.criteria && category.criteria.length > 0 ? (
                        <>
                          <div className="space-y-6">
                            {category.criteria.map((item) => {
                              if (!item._id) return null;
                              const ans = evaluationAnswers[item._id] || {
                                status: 'compliant',
                                rating: 'Low',
                                comment: ''
                              };

                              return (
                                <div
                                  key={item._id}
                                  className="space-y-4 pb-5 last:pb-0 border-b last:border-b-0 border-[#2C2A45]/30"
                                >
                                  <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                                    <div className="flex-1 space-y-1">
                                      <div className="text-sm font-semibold text-white/90">
                                        {item.criterion}
                                      </div>
                                      <div className="text-xs text-white/60">
                                        <span className="font-semibold">Evidence:</span> {item.evidence}
                                      </div>
                                    </div>

                                    <div className="flex flex-wrap items-center gap-3">
                                      {/* Rating Selector */}
                                      <div className="flex items-center overflow-hidden rounded border border-white/10 w-fit">
                                        {(['Low', 'Medium', 'High'] as const).map((r) => {
                                          const isSelected = ans.rating === r;
                                          let activeClass = '';
                                          if (isSelected) {
                                            if (r === 'Low')
                                              activeClass =
                                                'bg-green-600 text-white border-green-600';
                                            if (r === 'Medium')
                                              activeClass =
                                                'bg-yellow-500 text-white border-yellow-500';
                                            if (r === 'High')
                                              activeClass = 'bg-red-600 text-white border-red-600';
                                          } else {
                                            activeClass =
                                              'bg-transparent text-white/40 hover:text-white border-white/5';
                                          }

                                          return (
                                            <button
                                              key={r}
                                              type="button"
                                              onClick={() => handleRatingChange(item._id!, r)}
                                              className={`px-4 py-2 text-xs font-bold uppercase border-r last:border-r-0 tracking-wider transition-colors min-w-22 text-center ${activeClass}`}
                                            >
                                              {r}
                                            </button>
                                          );
                                        })}
                                      </div>
                                    </div>
                                  </div>

                                  {/* Comment Field */}
                                  <div className="space-y-2">
                                    <label className="block text-xs font-semibold text-gray-400">
                                      Comment / Verification Note
                                    </label>
                                    <textarea
                                      value={ans.comment}
                                      onChange={(e) =>
                                        handleCommentChange(item._id!, e.target.value)
                                      }
                                      placeholder="Add observations, audit findings, or remarks..."
                                      rows={2}
                                      className="w-full border border-[#2C2A45] bg-[#14112E]/50 px-4 py-3 text-sm text-white placeholder:text-white/20 outline-none transition focus:border-[#F68E2D] resize-none"
                                    />
                                  </div>
                                </div>
                              );
                            })}
                          </div>

                          {/* Submit Actions */}
                          <div className="mt-8 flex justify-end gap-4 border-t border-[#2C2A45] pt-5">
                            <button
                              type="button"
                              onClick={() => toggleCategory(category._id!)}
                              disabled={isSubmitting}
                              className="px-5 py-2 rounded border border-[#F68E2D]/60 text-xs font-semibold text-[#B8BDC7] hover:bg-white/[0.02] transition-colors disabled:opacity-50"
                            >
                              Cancel
                            </button>
                            <button
                              type="button"
                              onClick={() => handleSaveEvaluation(category)}
                              disabled={isSubmitting}
                              className="bg-[#F68E2D] hover:bg-[#e57d1f] text-white px-5 py-2 rounded text-xs font-semibold transition-colors shadow disabled:opacity-50 flex items-center gap-1.5"
                            >
                              {isSubmitting && (
                                <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                </svg>
                              )}
                              Save Evaluation
                            </button>
                          </div>
                        </>
                      ) : (
                        <div className="text-center py-4 text-sm text-white/50">
                          This category has no criteria templates assigned yet.
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
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
      {/* Stat KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 border border-[#2C2A45] bg-[#14112E] divide-y md:divide-y-0 md:divide-x divide-[#2C2A45]">
        {/* Total Audits */}
        <div className="flex items-center justify-between p-6">
          <div className="flex items-center gap-3">
            <svg className="w-7 h-7 text-[#F68E2D]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">No. of Audits</span>
          </div>
          <span className="text-2xl font-bold text-[#F68E2D]">{summary?.numberOfAudits ?? 0}</span>
        </div>

        {/* Active Alerts */}
        <div className="flex items-center justify-between p-6">
          <div className="flex items-center gap-3">
            <svg className="w-7 h-7 text-[#F68E2D]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Active Alerts</span>
          </div>
          <span className="text-2xl font-bold text-[#F68E2D]">{summary?.activeAlerts ?? 0}</span>
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

      {/* Completed Audits Grid */}
      <div className="space-y-4">
        <h3 className="text-sm font-semibold tracking-wider text-gray-400 uppercase">
          Completed Audit History ({completedChecks.length})
        </h3>

        {completedChecks.length === 0 ? (
          <div className="text-center py-12 text-white/50 border border-[#2C2A45] bg-[#14112E] rounded">
            No compliance audits recorded so far. Click Edit to run a new audit.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {completedChecks.map((item) => (
              <div
                key={item._id}
                className="bg-[#0C0A1F] rounded border border-[#2C2A45] p-5 flex flex-col justify-between h-36 hover:border-[#F68E2D]/35 transition-all"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h4 className="text-sm font-bold text-white tracking-wide uppercase leading-tight">
                      {item.categoryName}
                    </h4>
                    <span className="text-xs text-white/50">
                      Audited by:{' '}
                      {typeof item.auditedBy === 'object' ? item.auditedBy.name : 'System Admin'}
                    </span>
                  </div>

                  <div className="flex items-center px-3 py-1 rounded-full text-xs font-bold bg-[#1B2C24] text-[#4ADE80] border border-[#22C55E]/10">
                    <span>{item.complianceScore.toFixed(2)}% Score</span>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs text-gray-400 gap-1 mt-2">
                  <div className="flex items-center gap-1.5">
                    <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span>Date: {new Date(item.createdAt).toLocaleDateString()}</span>
                  </div>
                  <span className="text-[11px] text-[#F68E2D]">
                    {item.answers.filter((a) => a.status === 'non-compliant').length} Issues Flagged
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AuditsTab;
