import React, { useMemo, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  fetchAuditCategories,
  createAuditCategory,
  updateAuditCategory,
  deleteAuditCategory,
  type AuditCategory
} from '../services/auditsApi';

type Audience = 'agent' | 'university';

export const CompliancesPage: React.FC = () => {
  const [audience, setAudience] = useState<Audience>('agent');
  const [searchTerm, setSearchTerm] = useState('');
  
  // State for categories list
  const [categories, setCategories] = useState<AuditCategory[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // State for Add Modal
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [auditName, setAuditName] = useState('');
  const [auditDescription, setAuditDescription] = useState('');

  // State for Edit Modal
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<AuditCategory | null>(null);
  const [editName, setEditName] = useState('');
  const [editDescription, setEditDescription] = useState('');

  // General form submission states
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const navigate = useNavigate();

  const fetchCategories = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await fetchAuditCategories(audience);
      setCategories(data);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch audit categories.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, [audience]);

  const handleAddCategory = async () => {
    if (!auditName.trim() || !auditDescription.trim()) {
      setSubmitError('Audit Name and Description are required.');
      return;
    }
    setIsSubmitting(true);
    setSubmitError(null);
    try {
      await createAuditCategory({
        name: auditName.trim(),
        description: auditDescription.trim(),
        target: audience,
      });
      setAuditName('');
      setAuditDescription('');
      setIsAddModalOpen(false);
      fetchCategories();
    } catch (err: any) {
      setSubmitError(err.message || 'Failed to create audit category.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditClick = (category: AuditCategory) => {
    setEditingCategory(category);
    setEditName(category.name);
    setEditDescription(category.description);
    setSubmitError(null);
    setIsEditModalOpen(true);
  };

  const handleEditCategory = async () => {
    if (!editingCategory || !editingCategory._id) return;
    if (!editName.trim() || !editDescription.trim()) {
      setSubmitError('Audit Name and Description are required.');
      return;
    }
    setIsSubmitting(true);
    setSubmitError(null);
    try {
      await updateAuditCategory(editingCategory._id, {
        name: editName.trim(),
        description: editDescription.trim(),
      });
      setIsEditModalOpen(false);
      setEditingCategory(null);
      fetchCategories();
    } catch (err: any) {
      setSubmitError(err.message || 'Failed to update audit category.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteClick = async (category: AuditCategory) => {
    if (!category._id) return;
    if (!window.confirm(`Are you sure you want to delete "${category.name}"?`)) {
      return;
    }
    try {
      await deleteAuditCategory(category._id);
      fetchCategories();
    } catch (err: any) {
      alert(err.message || 'Failed to delete audit category.');
    }
  };

  const items = useMemo(() => {
    if (!searchTerm.trim()) {
      return categories;
    }

    const query = searchTerm.toLowerCase();
    return categories.filter(
      (item) =>
        item.name.toLowerCase().includes(query) ||
        item.description.toLowerCase().includes(query)
    );
  }, [categories, searchTerm]);

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
            onClick={() => {
              setSubmitError(null);
              setIsAddModalOpen(true);
            }}
            className="flex items-center gap-2 bg-[#F68E2D] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#F68E2D]/90"
          >
            <span className="text-xl leading-none">+</span>
            Add
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-500/20 border border-red-500 text-red-200 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {isLoading ? (
        <div className="flex justify-center py-12">
          <svg className="animate-spin h-8 w-8 text-[#F68E2D]" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
        </div>
      ) : items.length === 0 ? (
        <div className="text-center py-12 text-white/50 border border-[#283156] bg-[#15123A]">
          No audit categories found. Add a new one to get started.
        </div>
      ) : (
        <div className="space-y-4">
          {items.map((item) => (
            <section
              key={item._id}
              className="border border-[#283156] bg-[#15123A] px-8 py-7"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="max-w-[88%]">
                  <h2 className="text-lg font-semibold leading-tight text-white">{item.name}</h2>
                  <p className="mt-3 text-sm leading-snug text-white/90">{item.description}</p>
                </div>

                <div className="mt-1 flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => handleEditClick(item)}
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
                    onClick={() => navigate(`/compliances/view/${item._id}`)}
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
                  <button
                    type="button"
                    onClick={() => handleDeleteClick(item)}
                    className="flex h-9 w-9 items-center justify-center rounded-full bg-red-600 text-white transition hover:bg-red-700"
                    title="Delete"
                  >
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            </section>
          ))}
        </div>
      )}

      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="w-full max-w-3xl rounded-lg border border-white/10 bg-[#15123A] text-white shadow-[0_30px_90px_rgba(0,0,0,0.45)]">
            <div className="p-8 lg:p-10">
              <h2 className="text-2xl font-semibold tracking-[-0.03em]">Add {audience === 'agent' ? 'Agent' : 'University'} Audit</h2>

              {submitError && (
                <div className="mt-4 bg-red-500/20 border border-red-500 text-red-200 px-4 py-2 rounded text-sm">
                  {submitError}
                </div>
              )}

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
                  disabled={isSubmitting}
                  className="min-w-45 border border-[#F68E2D] bg-white px-6 py-4 text-lg font-medium text-[#B8BDC7] transition hover:bg-white/95 disabled:opacity-50"
                >
                  Discard
                </button>
                <button
                  type="button"
                  onClick={handleAddCategory}
                  disabled={isSubmitting}
                  className="min-w-45 bg-[#F68E2D] px-6 py-4 text-lg font-semibold text-white transition hover:bg-[#F68E2D]/90 disabled:opacity-50 flex items-center justify-center gap-2"
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

      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="w-full max-w-3xl rounded-lg border border-white/10 bg-[#15123A] text-white shadow-[0_30px_90px_rgba(0,0,0,0.45)]">
            <div className="p-8 lg:p-10">
              <h2 className="text-2xl font-semibold tracking-[-0.03em]">Edit {audience === 'agent' ? 'Agent' : 'University'} Audit</h2>

              {submitError && (
                <div className="mt-4 bg-red-500/20 border border-red-500 text-red-200 px-4 py-2 rounded text-sm">
                  {submitError}
                </div>
              )}

              <div className="mt-7 space-y-8">
                <div>
                  <label className="mb-4 block text-lg font-medium">
                    Audit Name <span className="text-[#F68E2D]">*</span>
                  </label>
                  <input
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    placeholder="Audit Name"
                    className="w-full border border-white/20 bg-transparent px-5 py-4 text-lg text-white placeholder:text-white/40 outline-none transition focus:border-[#F68E2D]"
                  />
                </div>

                <div>
                  <label className="mb-4 block text-lg font-medium">
                    Description <span className="text-[#F68E2D]">*</span>
                  </label>
                  <textarea
                    value={editDescription}
                    onChange={(e) => setEditDescription(e.target.value)}
                    placeholder="Description"
                    rows={6}
                    className="w-full border border-white/20 bg-transparent px-5 py-4 text-lg text-white placeholder:text-white/40 outline-none transition focus:border-[#F68E2D] resize-none"
                  />
                </div>
              </div>

              <div className="mt-12 flex flex-col gap-4 sm:flex-row sm:justify-center">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  disabled={isSubmitting}
                  className="min-w-45 border border-[#F68E2D] bg-white px-6 py-4 text-lg font-medium text-[#B8BDC7] transition hover:bg-white/95 disabled:opacity-50"
                >
                  Discard
                </button>
                <button
                  type="button"
                  onClick={handleEditCategory}
                  disabled={isSubmitting}
                  className="min-w-45 bg-[#F68E2D] px-6 py-4 text-lg font-semibold text-white transition hover:bg-[#F68E2D]/90 disabled:opacity-50 flex items-center justify-center gap-2"
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
  );
};

export default CompliancesPage;
