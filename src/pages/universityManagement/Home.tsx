import React, { useEffect, useMemo, useState } from 'react';
import { ChevronDown, ChevronLeft, ChevronRight, Eye, Pencil, Search, Trash2, Check, X } from 'lucide-react';
import InfoView from './Info';
import AcceptRejectModal from '../../components/AcceptRejectModal';
import ConfirmModal from '../../components/ConfirmModal';
import type { University } from './mockData';
import {
  fetchAdminUniversities,
  acceptUniversity,
  rejectUniversity,
  deleteUniversity,
} from '../../services/adminManagementApi';

const ENTRIES_OPTIONS = [8, 16, 24];

type UniversityApiRecord = {
  _id?: string;
  id?: string;
  name?: string;
  email?: string;
  phone?: string | null;
  website?: string | null;
  region?: string | null;
  country?: string | null;
  city?: string | null;
  logo?: string | null;
  status?: string | null;
  userId?: {
    _id?: string;
    name?: string;
    email?: string;
    phone?: string | null;
  };
  createdBy?: {
    _id?: string;
    name?: string;
    email?: string;
    phone?: string | null;
  };
};

const UniManagementHome: React.FC = () => {
  const [search, setSearch] = useState('');
  const [entriesPerPage, setEntriesPerPage] = useState(8);
  const [currentPage, setCurrentPage] = useState(1);
  const [showEntriesDropdown, setShowEntriesDropdown] = useState(false);
  const [viewingUniversity, setViewingUniversity] = useState<University | null>(null);
  const [universitiesData, setUniversitiesData] = useState<University[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Modal states
  const [acceptRejectModal, setAcceptRejectModal] = useState<{
    isOpen: boolean;
    type: 'accept' | 'reject';
    university: University | null;
  }>({ isOpen: false, type: 'accept', university: null });

  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean;
    university: University | null;
  }>({ isOpen: false, university: null });

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return universitiesData;

    return universitiesData.filter(
      (item) =>
        item.name.toLowerCase().includes(query) ||
        item.email.toLowerCase().includes(query) ||
        item.location.toLowerCase().includes(query)
    );
  }, [search, universitiesData]);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const records = (await fetchAdminUniversities()) as UniversityApiRecord[];
        if (!mounted) return;

        const mapped = records.map((rec, index) => {
          const name = rec.name || rec.userId?.name || rec.createdBy?.name || 'Unknown';
          
          // Debug: Log the API response structure
          if (index === 0) {
            console.log('API Record structure:', rec);
            console.log('Extracted name:', name);
          }
          
          const shortCode = name
            .split(' ')
            .filter(Boolean)
            .map((part) => part[0])
            .join('')
            .toUpperCase()
            .slice(0, 2) || 'UN';

          const verified: University['verified'] = rec.status === 'approved' || rec.status === 'active' || rec.status === 'verified'
            ? 'green'
            : 'yellow';

          const uni: University = {
            id: index + 1,
            _id: rec._id, // Store the MongoDB ObjectId
            name,
            mobile: rec.phone ?? rec.userId?.phone ?? rec.createdBy?.phone ?? '',
            email: rec.email ?? rec.userId?.email ?? rec.createdBy?.email ?? '',
            location: [rec.city, rec.region, rec.country].filter(Boolean).join(', ') || '—',
            shortCode,
            logoColor: '#5C2EA8',
            verified,
            online: verified === 'green',
          };

          return uni;
        });

        setUniversitiesData(mapped);
      } catch (err: any) {
        setError(err?.message || 'Failed to load universities');
      } finally {
        setLoading(false);
      }
    };

    load();
    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [search, entriesPerPage]);

  const handleAccept = async (notes?: string) => {
    if (!acceptRejectModal.university) return;
    const uniId = acceptRejectModal.university._id;
    if (!uniId) {
      throw new Error('University ID not available');
    }
    await acceptUniversity(uniId, notes);
    // Refresh the list
    setUniversitiesData((prev) =>
      prev.map((uni) =>
        uni.id === acceptRejectModal.university!.id ? { ...uni, verified: 'green', online: true } : uni
      )
    );
  };

  const handleReject = async (reason?: string, notes?: string) => {
    if (!acceptRejectModal.university) return;
    const uniId = acceptRejectModal.university._id;
    if (!uniId) {
      throw new Error('University ID not available');
    }
    await rejectUniversity(uniId, reason || '', notes);
    // Refresh the list
    setUniversitiesData((prev) =>
      prev.map((uni) =>
        uni.id === acceptRejectModal.university!.id ? { ...uni, verified: 'yellow', online: false } : uni
      )
    );
  };

  const handleDelete = async () => {
    if (!deleteModal.university) return;
    const uniId = deleteModal.university._id;
    if (!uniId) {
      throw new Error('University ID not available');
    }
    await deleteUniversity(uniId);
    // Remove from list
    setUniversitiesData((prev) => prev.filter((uni) => uni.id !== deleteModal.university!.id));
  };

  const totalEntries = filtered.length;
  const totalPages = Math.max(1, Math.ceil(totalEntries / entriesPerPage));
  const startIndex = (currentPage - 1) * entriesPerPage;
  const paginatedRows = filtered.slice(startIndex, startIndex + entriesPerPage);

  const pageNumbers = totalPages <= 5 ? Array.from({ length: totalPages }, (_, index) => index + 1) : [1, 2, 3, '...', totalPages];

  if (viewingUniversity) {
    return (
      <div className="space-y-4">
        <button type="button" onClick={() => setViewingUniversity(null)} className="text-sm text-white/80 hover:text-white">
          ← Back to Uni Management
        </button>
        <InfoView
          university={viewingUniversity}
        />
      </div>
    );
  }

  return (
    <div className="relative space-y-4">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <h1 className="text-3xl font-semibold leading-tight text-white">Uni Management</h1>
          <p className="mt-2 text-sm text-white/85">Manage all of your Agent and Agency here.</p>
        </div>

        <div className="flex w-full flex-col items-stretch gap-3 sm:flex-row sm:items-center lg:w-auto">
          <div className="relative min-w-70 lg:min-w-105">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search"
              className="w-full border border-[#5A6280] bg-transparent px-4 py-4 pr-12 text-sm text-white outline-none placeholder:text-white/70"
            />
            <Search className="absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#25385C]" />
          </div>
        </div>
      </div>

      {loading && <div className="rounded border border-white/20 bg-white/5 px-4 py-3 text-sm text-white/80">Loading universities...</div>}

      {error && (
        <div className="flex items-center justify-between rounded border border-red-400/40 bg-red-500/10 px-4 py-3 text-sm text-red-100">
          <span>{error}</span>
        </div>
      )}

      <div className="overflow-x-auto border border-[#6A708D]">
        <table className="min-w-305 w-full bg-[#14123A]">
          <thead>
            <tr className="border-b border-[#6A708D]">
              <th className="px-6 py-5 text-center text-sm font-semibold text-white">Image</th>
              <th className="px-6 py-5 text-center text-sm font-semibold text-white">Name</th>
              <th className="px-6 py-5 text-center text-sm font-semibold text-white">Mobile Number</th>
              <th className="px-6 py-5 text-center text-sm font-semibold text-white">Email</th>
              <th className="px-6 py-5 text-center text-sm font-semibold text-white">Location</th>
              <th className="px-6 py-5 text-center text-sm font-semibold text-white">Action</th>
            </tr>
          </thead>
          <tbody>
            {!loading && paginatedRows.map((university) => (
              <tr key={university.id} className="border-t border-[#6A708D] text-sm text-white/95">
                <td className="px-6 py-4">
                  <div className="relative flex justify-center">
                    <div
                      className="flex h-8 w-8 items-center justify-center rounded-full text-[10px] font-bold text-white"
                      style={{ backgroundColor: university.logoColor }}
                    >
                      {university.shortCode}
                    </div>
                    <span
                      className={`absolute -bottom-0.5 right-[calc(50%-16px)] translate-x-4 h-2.5 w-2.5 rounded-full border border-white ${
                        university.online ? 'bg-[#32D74B]' : 'bg-[#A0A0A0]'
                      }`}
                    />
                  </div>
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-center">
                  <div className="inline-flex items-center gap-1.5">
                    <span className="text-white">{university.name}</span>
                    <span
                      className={`flex h-3.5 w-3.5 items-center justify-center rounded-full ${
                        university.verified === 'green' ? 'bg-[#00D39B]' : 'bg-[#FACC15]'
                      }`}
                    >
                      <svg viewBox="0 0 20 20" fill="currentColor" className="h-2.5 w-2.5 text-[#161435]">
                        <path
                          fillRule="evenodd"
                          d="M16.704 5.29a1 1 0 010 1.415l-7.2 7.2a1 1 0 01-1.415 0l-3.2-3.2a1 1 0 011.415-1.415l2.492 2.493 6.492-6.493a1 1 0 011.416 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </span>
                  </div>
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-center">{university.mobile}</td>
                <td className="whitespace-nowrap px-6 py-4 text-center">{university.email}</td>
                <td className="whitespace-nowrap px-6 py-4 text-center">{university.location}</td>
                <td className="px-6 py-4">
                  <div className="flex items-center justify-center gap-2">
                    <button
                      type="button"
                      onClick={() => setViewingUniversity(university)}
                      className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#F7941D] transition-colors hover:bg-[#e28518]"
                      aria-label="View"
                    >
                      <Eye className="h-3.5 w-3.5 text-white" />
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        // TODO: Implement edit modal with form
                        console.log('Edit university:', university);
                      }}
                      className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#3F5AE6] transition-colors hover:bg-[#334bd0]"
                      aria-label="Edit"
                    >
                      <Pencil className="h-3.5 w-3.5 text-white" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setDeleteModal({ isOpen: true, university })}
                      className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#ED3941] transition-colors hover:bg-[#d1323a]"
                      aria-label="Delete"
                    >
                      <Trash2 className="h-3.5 w-3.5 text-white" />
                    </button>
                    {university.verified === 'yellow' && (
                      <>
                        <button
                          type="button"
                          onClick={() => setAcceptRejectModal({ isOpen: true, type: 'accept', university })}
                          className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#16A34A] transition-colors hover:bg-[#15803d]"
                          aria-label="Approve"
                        >
                          <Check className="h-3.5 w-3.5 text-white" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setAcceptRejectModal({ isOpen: true, type: 'reject', university })}
                          className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#EF4444] transition-colors hover:bg-[#dc2626]"
                          aria-label="Reject"
                        >
                          <X className="h-3.5 w-3.5 text-white" />
                        </button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
            {!loading && paginatedRows.length === 0 && (
              <tr className="border-t border-[#6A708D]">
                <td colSpan={6} className="px-6 py-8 text-center text-sm text-white/70">
                  No universities found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2 text-xs text-white">
          <button
            type="button"
            onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
            disabled={currentPage === 1}
            className="flex h-7 w-7 items-center justify-center rounded-lg border border-white/60 text-white disabled:opacity-40"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          {pageNumbers.map((page, index) =>
            typeof page === 'number' ? (
              <button
                type="button"
                key={`${page}-${index}`}
                onClick={() => setCurrentPage(page)}
                className={`flex h-7 w-7 items-center justify-center rounded-lg font-medium ${
                  page === currentPage ? 'bg-[#F7941D] text-white' : 'text-white/90'
                }`}
              >
                {page}
              </button>
            ) : (
              <span key={`${page}-${index}`} className="px-1 text-white/80">
                {page}
              </span>
            )
          )}
          <button
            type="button"
            onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
            disabled={currentPage === totalPages}
            className="flex h-7 w-7 items-center justify-center rounded-lg border border-white/60 text-white disabled:opacity-40"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs text-white/70">
            Showing {totalEntries === 0 ? 0 : startIndex + 1} to {Math.min(currentPage * entriesPerPage, totalEntries)} of {totalEntries} entries
          </span>
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowEntriesDropdown((prev) => !prev)}
              className="inline-flex items-center gap-2 rounded bg-[#F3F4F6] px-3 py-1 text-xs text-black"
            >
              Show {entriesPerPage}
              <ChevronDown className="h-3 w-3" />
            </button>
            {showEntriesDropdown && (
              <div className="absolute right-0 z-10 mt-1 min-w-20 overflow-hidden rounded bg-white shadow-md">
                {ENTRIES_OPTIONS.map((option) => (
                  <button
                    type="button"
                    key={option}
                    onClick={() => {
                      setEntriesPerPage(option);
                      setCurrentPage(1);
                      setShowEntriesDropdown(false);
                    }}
                    className="w-full px-3 py-1.5 text-left text-sm hover:bg-gray-100"
                  >
                    {option}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <AcceptRejectModal
        isOpen={acceptRejectModal.isOpen}
        type={acceptRejectModal.type}
        universityName={acceptRejectModal.university?.name || ''}
        onConfirm={acceptRejectModal.type === 'accept' ? handleAccept : handleReject}
        onClose={() => setAcceptRejectModal({ isOpen: false, type: 'accept', university: null })}
      />

      <ConfirmModal
        isOpen={deleteModal.isOpen}
        title="Delete University"
        message={`Are you sure you want to delete ${deleteModal.university?.name}? This action cannot be undone.`}
        confirmText="Delete"
        isDangerous
        onConfirm={handleDelete}
        onClose={() => setDeleteModal({ isOpen: false, university: null })}
      />
    </div>
  );
};

export default UniManagementHome;
