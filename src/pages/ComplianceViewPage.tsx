import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { DeleteIcon, EditIcon } from '../components/ui/icons';
import {
  getAuditCategoryById,
  addAuditCriterion,
  updateAuditCriterion,
  deleteAuditCriterion,
  type AuditCategory,
  type AuditCriterion
} from '../services/auditsApi';

export const ComplianceViewPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // State for category details
  const [category, setCategory] = useState<AuditCategory | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // State for Add Modal
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [newCriterion, setNewCriterion] = useState('');
  const [newEvidence, setNewEvidence] = useState('');

  // State for Edit Modal
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editingCriterion, setEditingCriterion] = useState<AuditCriterion | null>(null);
  const [editCriterionText, setEditCriterionText] = useState('');
  const [editEvidenceText, setEditEvidenceText] = useState('');

  // General submission state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const fetchCategoryDetails = async () => {
    if (!id) return;
    setIsLoading(true);
    setError(null);
    try {
      const data = await getAuditCategoryById(id);
      setCategory(data);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch audit details.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCategoryDetails();
  }, [id]);

  const handleAddOpen = () => {
    setSubmitError(null);
    setIsAddOpen(true);
  };
  
  const handleAddClose = () => {
    setIsAddOpen(false);
    setNewCriterion('');
    setNewEvidence('');
    setSubmitError(null);
  };

  const handleAdd = async () => {
    const title = newCriterion.trim();
    const evidence = newEvidence.trim();
    if (!title || !evidence) {
      setSubmitError('Criterion and evidence are required.');
      return;
    }
    if (!id) return;
    
    setIsSubmitting(true);
    setSubmitError(null);
    try {
      await addAuditCriterion(id, { criterion: title, evidence });
      handleAddClose();
      fetchCategoryDetails();
    } catch (err: any) {
      setSubmitError(err.message || 'Failed to add audit criterion.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditOpen = (c: AuditCriterion) => {
    setEditingCriterion(c);
    setEditCriterionText(c.criterion);
    setEditEvidenceText(c.evidence);
    setSubmitError(null);
    setIsEditOpen(true);
  };

  const handleEditClose = () => {
    setIsEditOpen(false);
    setEditingCriterion(null);
    setEditCriterionText('');
    setEditEvidenceText('');
    setSubmitError(null);
  };

  const handleEdit = async () => {
    if (!id || !editingCriterion?._id || !editCriterionText.trim() || !editEvidenceText.trim()) {
      setSubmitError('Criterion and evidence are required.');
      return;
    }
    setIsSubmitting(true);
    setSubmitError(null);
    try {
      await updateAuditCriterion(id, editingCriterion._id, {
        criterion: editCriterionText.trim(),
        evidence: editEvidenceText.trim(),
      });
      handleEditClose();
      fetchCategoryDetails();
    } catch (err: any) {
      setSubmitError(err.message || 'Failed to update criterion.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (criterionId: string) => {
    if (!id) return;
    if (!window.confirm('Are you sure you want to delete this criterion?')) {
      return;
    }
    try {
      await deleteAuditCriterion(id, criterionId);
      fetchCategoryDetails();
    } catch (err: any) {
      alert(err.message || 'Failed to delete criterion.');
    }
  };

  if (isLoading && !category) {
    return (
      <div className="flex justify-center items-center py-24 text-white">
        <svg className="animate-spin h-8 w-8 text-[#F68E2D]" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-4 text-white">
        <button
          onClick={() => navigate('/compliances')}
          className="text-white/60 hover:text-white transition flex items-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back
        </button>
        <div className="bg-red-500/20 border border-red-500 text-red-200 px-4 py-3 rounded">
          {error}
        </div>
      </div>
    );
  }

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
          <button onClick={handleAddOpen} className="bg-[#F68E2D] px-6 py-2.5 font-semibold text-white hover:bg-[#F68E2D]/90 transition">+ Add Criterion</button>
        </div>
      </div>

      <div className="rounded-lg border border-white/10 bg-[#15123A] p-6">
        <h2 className="text-xl font-semibold mb-4">{category?.name || 'Loading...'}</h2>
        <p className="text-white/70 mb-6">{category?.description || ''}</p>

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
              {category?.criteria && category.criteria.length > 0 ? (
                category.criteria.map((c, index) => (
                  <tr key={c._id} className="border-b border-white/10">
                    <td className="px-4 py-4 text-sm align-top">{index + 1}</td>
                    <td className="px-4 py-4 text-sm align-top">{c.criterion}</td>
                    <td className="px-4 py-4 text-sm align-top">{c.evidence}</td>
                    <td className="px-4 py-4 text-sm align-top">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleEditOpen(c)}
                          title="Edit"
                          aria-label="Edit criterion"
                          className="h-8 w-8 rounded-md flex items-center justify-center bg-[#3B53D7] text-white hover:opacity-95 transition"
                        >
                          <EditIcon />
                        </button>
                        <button
                          onClick={() => handleDelete(c._id!)}
                          title="Delete"
                          aria-label="Delete criterion"
                          className="h-8 w-8 rounded-md flex items-center justify-center bg-red-500 text-white hover:opacity-95 transition"
                        >
                          <DeleteIcon />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="px-4 py-8 text-center text-white/40">
                    No criteria defined. Add a criterion to this audit.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {isAddOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
            <div className="w-full max-w-4xl rounded-lg border border-white/10 bg-[#0F0C23] text-white">
              <div className="p-8">
                <h2 className="text-2xl font-semibold mb-6">Add Audit Criterion</h2>

                {submitError && (
                  <div className="mb-4 bg-red-500/20 border border-red-500 text-red-200 px-4 py-2 rounded text-sm">
                    {submitError}
                  </div>
                )}

                <div className="space-y-6">
                  <div>
                    <label className="block mb-2 text-sm font-medium">Audit Criterion <span className="text-[#F68E2D]">*</span></label>
                    <textarea
                      value={newCriterion}
                      onChange={(e) => setNewCriterion(e.target.value)}
                      placeholder="Audit Criterion"
                      rows={3}
                      className="w-full border border-white/10 bg-transparent px-4 py-3 text-sm text-white placeholder:text-white/40 outline-none transition focus:border-[#F68E2D]"
                    />
                  </div>

                  <div>
                    <label className="block mb-2 text-sm font-medium">Evidence <span className="text-[#F68E2D]">*</span></label>
                    <textarea
                      value={newEvidence}
                      onChange={(e) => setNewEvidence(e.target.value)}
                      placeholder="Evidence"
                      rows={3}
                      className="w-full border border-white/10 bg-transparent px-4 py-3 text-sm text-white placeholder:text-white/40 outline-none transition focus:border-[#F68E2D]"
                    />
                  </div>
                </div>

                <div className="mt-8 flex justify-center gap-6">
                  <button
                    onClick={handleAddClose}
                    disabled={isSubmitting}
                    className="min-w-45 border border-[#F68E2D] bg-white px-6 py-3 text-sm font-medium text-[#B8BDC7] hover:bg-white/95 disabled:opacity-50 transition"
                  >
                    Discard
                  </button>
                  <button
                    onClick={handleAdd}
                    disabled={isSubmitting}
                    className="min-w-45 bg-[#F68E2D] px-6 py-3 text-sm font-semibold text-white hover:bg-[#F68E2D]/90 disabled:opacity-50 transition flex items-center justify-center gap-2"
                  >
                    {isSubmitting && (
                      <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                    )}
                    Add
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {isEditOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
            <div className="w-full max-w-4xl rounded-lg border border-white/10 bg-[#0F0C23] text-white">
              <div className="p-8">
                <h2 className="text-2xl font-semibold mb-6">Edit Audit Criterion</h2>

                {submitError && (
                  <div className="mb-4 bg-red-500/20 border border-red-500 text-red-200 px-4 py-2 rounded text-sm">
                    {submitError}
                  </div>
                )}

                <div className="space-y-6">
                  <div>
                    <label className="block mb-2 text-sm font-medium">Audit Criterion <span className="text-[#F68E2D]">*</span></label>
                    <textarea
                      value={editCriterionText}
                      onChange={(e) => setEditCriterionText(e.target.value)}
                      placeholder="Audit Criterion"
                      rows={3}
                      className="w-full border border-white/10 bg-transparent px-4 py-3 text-sm text-white placeholder:text-white/40 outline-none transition focus:border-[#F68E2D]"
                    />
                  </div>

                  <div>
                    <label className="block mb-2 text-sm font-medium">Evidence <span className="text-[#F68E2D]">*</span></label>
                    <textarea
                      value={editEvidenceText}
                      onChange={(e) => setEditEvidenceText(e.target.value)}
                      placeholder="Evidence"
                      rows={3}
                      className="w-full border border-white/10 bg-transparent px-4 py-3 text-sm text-white placeholder:text-white/40 outline-none transition focus:border-[#F68E2D]"
                    />
                  </div>
                </div>

                <div className="mt-8 flex justify-center gap-6">
                  <button
                    onClick={handleEditClose}
                    disabled={isSubmitting}
                    className="min-w-45 border border-[#F68E2D] bg-white px-6 py-3 text-sm font-medium text-[#B8BDC7] hover:bg-white/95 disabled:opacity-50 transition"
                  >
                    Discard
                  </button>
                  <button
                    onClick={handleEdit}
                    disabled={isSubmitting}
                    className="min-w-45 bg-[#F68E2D] px-6 py-3 text-sm font-semibold text-white hover:bg-[#F68E2D]/90 disabled:opacity-50 transition flex items-center justify-center gap-2"
                  >
                    {isSubmitting && (
                      <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                    )}
                    Save
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
