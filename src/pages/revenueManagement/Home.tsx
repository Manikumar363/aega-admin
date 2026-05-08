import React, { useEffect, useMemo, useState } from 'react';
import { ChevronDown, ChevronLeft, ChevronRight, Eye, Pencil, Search } from 'lucide-react';
import type { RevenueRow } from './mockData';
import { sampleRevenueRows } from './mockData';

const ENTRIES_OPTIONS = [8, 16, 24];
const STORAGE_KEY = 'revenue_list_v1';

const RevenueManagementHome: React.FC = () => {
  const [search, setSearch] = useState('');
  const [entriesPerPage, setEntriesPerPage] = useState(8);
  const [currentPage, setCurrentPage] = useState(1);
  const [showEntriesDropdown, setShowEntriesDropdown] = useState(false);
  const [rows, setRows] = useState<RevenueRow[]>([]);

  useEffect(() => {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      try {
        const parsed = JSON.parse(raw) as RevenueRow[];
        if (Array.isArray(parsed) && parsed.length > 0) {
          setRows(parsed);
          return;
        }
      } catch {}
    }

    setRows(sampleRevenueRows);
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(rows));
  }, [rows]);

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return rows;

    return rows.filter(
      (row) =>
        row.organizationName.toLowerCase().includes(query) ||
        row.type.toLowerCase().includes(query) ||
        row.date.toLowerCase().includes(query) ||
        row.amount.toLowerCase().includes(query)
    );
  }, [rows, search]);

  useEffect(() => {
    setCurrentPage(1);
  }, [search, entriesPerPage]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / entriesPerPage));
  const startIndex = (currentPage - 1) * entriesPerPage;
  const paginatedRows = filtered.slice(startIndex, startIndex + entriesPerPage);

  const pageNumbers = (() => {
    if (totalPages <= 5) {
      return Array.from({ length: totalPages }, (_, index) => index + 1);
    }

    return [1, 2, 3, '...', totalPages];
  })();

  return (
    <div className="space-y-4 text-white">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
        <div>
          <h1 className="text-[30px] font-semibold leading-none text-white">Revenue Management</h1>
          <p className="mt-3 text-sm text-white/80">Manage all of your Revenue from here.</p>
        </div>

        <div className="flex w-full flex-col gap-3 sm:flex-row sm:items-center xl:w-auto xl:justify-end">
          <div className="relative w-full sm:w-95">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search"
              className="h-12 w-full border border-white/20 bg-transparent px-4 pr-12 text-sm text-white outline-none placeholder:text-white/65"
            />
            <Search className="pointer-events-none absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#0F1A36]" />
          </div>
        </div>
      </div>

      <div className="overflow-hidden border border-[#8A91AC] bg-[#14112E]">
        <div className="overflow-x-auto">
          <table className="min-w-225 w-full table-fixed border-separate border-spacing-0">
            <colgroup>
              <col className="w-[34%]" />
              <col className="w-[18%]" />
              <col className="w-[18%]" />
              <col className="w-[15%]" />
              <col className="w-[15%]" />
            </colgroup>
            <thead>
              <tr className="border-b border-[#8A91AC] text-sm font-semibold text-white">
                <th className="border-r border-[#8A91AC] px-4 py-3 text-center">Organization Name</th>
                <th className="border-r border-[#8A91AC] px-4 py-3 text-center">Type</th>
                <th className="border-r border-[#8A91AC] px-4 py-3 text-center">Date</th>
                <th className="border-r border-[#8A91AC] px-4 py-3 text-center">Amount</th>
                <th className="px-4 py-3 text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {paginatedRows.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-10 text-center text-white/75">
                    No revenue records found.
                  </td>
                </tr>
              ) : (
                paginatedRows.map((row) => (
                  <tr key={row.id} className="text-sm text-white/95">
                    <td className="border-r border-b border-[#6A708D] whitespace-nowrap px-6 py-4 text-center">{row.organizationName}</td>
                    <td className="border-r border-b border-[#6A708D] whitespace-nowrap px-6 py-4 text-center">{row.type}</td>
                    <td className="border-r border-b border-[#6A708D] whitespace-nowrap px-6 py-4 text-center">{row.date}</td>
                    <td className="border-r border-b border-[#6A708D] whitespace-nowrap px-6 py-4 text-center">{row.amount}</td>
                    <td className="border-b border-[#6A708D] px-6 py-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          type="button"
                          className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#F7941D] transition-colors hover:bg-[#e28518]"
                          aria-label="View revenue"
                        >
                          <Eye className="h-3.5 w-3.5 text-white" />
                        </button>
                        <button
                          type="button"
                          className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#3F5AE6] transition-colors hover:bg-[#334bd0]"
                          aria-label="Edit revenue"
                        >
                          <Pencil className="h-3.5 w-3.5 text-white" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
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
            Showing {filtered.length === 0 ? 0 : startIndex + 1} to {Math.min(currentPage * entriesPerPage, filtered.length)} of {filtered.length} entries
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
                    key={option}
                    type="button"
                    onClick={() => {
                      setEntriesPerPage(option);
                      setShowEntriesDropdown(false);
                    }}
                    className={`block w-full px-4 py-2 text-left text-sm ${
                      entriesPerPage === option ? 'bg-[#F7941D] text-white' : 'text-gray-800 hover:bg-gray-100'
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RevenueManagementHome;
