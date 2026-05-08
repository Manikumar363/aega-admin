import React, { useEffect, useMemo, useState } from 'react';
import { ChevronDown, ChevronLeft, ChevronRight, Eye, Pencil, Plus, Search, Trash2 } from 'lucide-react';
import AddUniversity from './addUniveristy';
import InfoView from './Info';
import type { University } from './mockData';
import { universities } from './mockData';

const ENTRIES_OPTIONS = [8, 16, 24];
const TOTAL_ENTRIES = 50;

const UniManagementHome: React.FC = () => {
  const [search, setSearch] = useState('');
  const [entriesPerPage, setEntriesPerPage] = useState(8);
  const [currentPage, setCurrentPage] = useState(1);
  const [showEntriesDropdown, setShowEntriesDropdown] = useState(false);
  const [showAddUniversity, setShowAddUniversity] = useState(false);
  const [viewingUniversity, setViewingUniversity] = useState<University | null>(null);

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return universities;

    return universities.filter(
      (item) =>
        item.name.toLowerCase().includes(query) ||
        item.email.toLowerCase().includes(query) ||
        item.location.toLowerCase().includes(query)
    );
  }, [search]);

  useEffect(() => {
    setCurrentPage(1);
  }, [search, entriesPerPage]);

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

          <button className="inline-flex items-center justify-center gap-2 bg-[#F7941D] px-6 py-4 text-sm font-medium text-white transition-colors hover:bg-[#e28518]">
            University Type
            <ChevronDown className="h-4 w-4" />
          </button>

          <button
            type="button"
            onClick={() => setShowAddUniversity(true)}
            className="inline-flex items-center justify-center gap-2 bg-[#F7941D] px-6 py-4 text-sm font-medium text-white transition-colors hover:bg-[#e28518]"
          >
            <Plus className="h-4 w-4" />
            Add University
          </button>
        </div>
      </div>

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
            {paginatedRows.map((university) => (
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
                    {university.name}
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
                      className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#3F5AE6] transition-colors hover:bg-[#334bd0]"
                      aria-label="Edit"
                    >
                      <Pencil className="h-3.5 w-3.5 text-white" />
                    </button>
                    <button
                      type="button"
                      className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#ED3941] transition-colors hover:bg-[#d1323a]"
                      aria-label="Delete"
                    >
                      <Trash2 className="h-3.5 w-3.5 text-white" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
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

      {showAddUniversity && <AddUniversity onClose={() => setShowAddUniversity(false)} />}
    </div>
  );
};

export default UniManagementHome;
