import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ViewCompany from './ViewCompany';
import { toast } from 'react-toastify';
import { SAMPLE_COMPANIES, type CompanyRow } from './mockData';

const ENTRIES_OPTIONS = [8, 16, 24];

const STORAGE_KEY = 'companies_list_v1';

const CompanyManagementHome: React.FC = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [entriesPerPage, setEntriesPerPage] = useState(8);
  const [currentPage, setCurrentPage] = useState(1);
  const [showEntriesDropdown, setShowEntriesDropdown] = useState(false);
  const [viewingCompany, setViewingCompany] = useState<CompanyRow | null>(null);
  const [companies, setCompanies] = useState<CompanyRow[]>([]);

  useEffect(() => {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      try {
        const parsed = JSON.parse(raw) as CompanyRow[];
        if (Array.isArray(parsed) && parsed.length > 0) {
          setCompanies(parsed);
          return;
        }
      } catch {}
    }
    setCompanies(SAMPLE_COMPANIES);
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(companies));
  }, [companies]);

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return companies;

    return companies.filter(
      (item) =>
        item.name.toLowerCase().includes(query) ||
        item.owner.toLowerCase().includes(query) ||
        item.email.toLowerCase().includes(query) ||
        item.region.toLowerCase().includes(query)
    );
  }, [companies, search]);

  useEffect(() => setCurrentPage(1), [search, entriesPerPage]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / entriesPerPage));
  const paginatedRows = filtered.slice((currentPage - 1) * entriesPerPage, currentPage * entriesPerPage);

  const pageNumbers = (() => {
    const pages: (number | string)[] = [];
    if (totalPages <= 5) {
      for (let p = 1; p <= totalPages; p += 1) pages.push(p);
      return pages;
    }
    pages.push(1);
    const start = Math.max(2, currentPage - 1);
    const end = Math.min(totalPages - 1, currentPage + 1);
    if (start > 2) pages.push('...');
    for (let p = start; p <= end; p += 1) pages.push(p);
    if (end < totalPages - 1) pages.push('...');
    pages.push(totalPages);
    return pages;
  })();

  const handleDelete = (id: number) => {
    if (!confirm('Delete this company?')) return;
    setCompanies((prev) => prev.filter((c) => c.id !== id));
    toast.success('Company deleted');
  };

  if (viewingCompany) {
    return (
      <div className="space-y-4">
        <button type="button" onClick={() => setViewingCompany(null)} className="text-sm text-white/80 hover:text-white">
          ← Back to Company Management
        </button>
        <ViewCompany company={{
          id: viewingCompany.id,
          name: viewingCompany.name,
          designation: viewingCompany.owner,
          mobile: viewingCompany.mobile,
          email: viewingCompany.email,
          location: viewingCompany.region,
          avatar: '/avatar.jpg',
          verified: 'blue',
          online: true,
        }} />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
        <div>
          <h1 className="text-[30px] font-semibold leading-none text-white">Company Management</h1>
          <p className="mt-3 text-sm text-white/80">Manage all of your Company here.</p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center xl:justify-end">
          <div className="relative w-full sm:w-95">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search"
                className="h-12 w-full border border-white/20 bg-transparent px-4 pr-12 text-sm text-white outline-none placeholder:text-white/65"
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-white/50">🔍</div>
          </div>

            <button className="inline-flex h-12 items-center gap-3 bg-[#F68E2D] px-4 text-sm font-medium text-white" onClick={() => {}}>
            Agent Type ▾
          </button>

          <button
            type="button"
            onClick={() => navigate('/office/add')}
              className="inline-flex h-12 items-center gap-3 bg-[#F68E2D] px-4 text-sm font-medium text-white"
          >
            + Add Company
          </button>
        </div>
      </div>

      <div className="overflow-hidden border border-[#8A91AC] bg-[#14112E]">
        <div className="overflow-x-auto overflow-y-hidden pb-2">
          <table className="min-w-225 w-full table-fixed border-separate border-spacing-0">
            <colgroup>
              <col className="w-[8%]" />
              <col className="w-[22%]" />
              <col className="w-[18%]" />
              <col className="w-[16%]" />
              <col className="w-[16%]" />
              <col className="w-[10%]" />
              <col className="w-[12%]" />
            </colgroup>
            <thead>
              <tr className="border-b border-[#8A91AC] text-sm font-semibold text-white">
                <th className="border-r border-[#8A91AC] px-4 py-3 text-center">Image</th>
                <th className="border-r border-[#8A91AC] px-4 py-3 text-center">Company Name</th>
                <th className="border-r border-[#8A91AC] px-4 py-3 text-center">Owner Name</th>
                <th className="border-r border-[#8A91AC] px-4 py-3 text-center">Mobile Number</th>
                <th className="border-r border-[#8A91AC] px-4 py-3 text-center">Email</th>
                <th className="border-r border-[#8A91AC] px-4 py-3 text-center">Location</th>
                <th className="px-4 py-3 text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {paginatedRows.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-10 text-center text-white/75">
                    No companies found.
                  </td>
                </tr>
              ) : (
                paginatedRows.map((row) => (
                  <tr key={row.id} className="text-sm text-white/90">
                    <td className="border-r border-b border-[#6A708D] px-4 py-4 text-center">
                      <div className="mx-auto flex h-8 w-8 items-center justify-center rounded-full bg-white text-[10px] font-bold text-[#1B153D]">
                        {row.initials}
                      </div>
                    </td>
                    <td className="border-r border-b border-[#6A708D] px-4 py-4 text-center">{row.name}</td>
                    <td className="border-r border-b border-[#6A708D] px-4 py-4 text-center">{row.owner}</td>
                    <td className="border-r border-b border-[#6A708D] px-4 py-4 text-center">{row.mobile}</td>
                    <td className="border-r border-b border-[#6A708D] px-4 py-4 text-center">{row.email}</td>
                    <td className="border-r border-b border-[#6A708D] px-4 py-4 text-center">{row.region}</td>
                    <td className="border-b border-[#6A708D] px-4 py-4 whitespace-nowrap text-center">
                      <div className="flex flex-nowrap items-center justify-center gap-2">
                        <button
                          type="button"
                          onClick={() => setViewingCompany(row)}
                          className="flex h-8 w-8 items-center justify-center rounded-md bg-[#F68E2D] text-white"
                          aria-label="View company"
                        >
                          👁️
                        </button>
                        <button
                          className="flex h-8 w-8 items-center justify-center rounded-md bg-[#4A5BE7] text-white"
                          aria-label="Edit company"
                          onClick={() => navigate(`/office/edit/${row.id}`)}
                        >
                          ✎
                        </button>
                        <button
                          className="flex h-8 w-8 items-center justify-center rounded-md bg-[#E03137] text-white"
                          aria-label="Delete company"
                          onClick={() => handleDelete(row.id)}
                        >
                          🗑
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

      <div className="flex flex-col gap-4 pb-3 pt-1 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center gap-2">
          <button onClick={() => setCurrentPage((p) => Math.max(1, p - 1))} disabled={currentPage === 1} className="h-8 w-8 rounded-md border border-white/20 text-white">
            ‹
          </button>

          {pageNumbers.map((page, i) =>
            typeof page === 'number' ? (
              <button key={page} onClick={() => setCurrentPage(page)} className={`h-8 min-w-8 rounded-md px-2 text-sm font-medium ${currentPage === page ? 'bg-[#F68E2D] text-white' : 'text-white/75'}`}>
                {page}
              </button>
            ) : (
              <span key={`${page}-${i}`} className="px-1 text-white/70">...</span>
            )
          )}

          <button onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} className="h-8 w-8 rounded-md border border-white/20 text-white">
            ›
          </button>
        </div>

        <div className="flex items-center gap-4 text-sm text-white/75">
          <span>
            Showing {filtered.length === 0 ? 0 : (currentPage - 1) * entriesPerPage + 1} to {Math.min(currentPage * entriesPerPage, filtered.length)} of {filtered.length} entries
          </span>

          <div className="relative">
            <button type="button" onClick={() => setShowEntriesDropdown((v) => !v)} className="inline-flex h-9 items-center gap-2 rounded-md bg-white px-3 text-sm text-[#222]">
              Show {entriesPerPage}
            </button>

            {showEntriesDropdown && (
              <div className="absolute right-0 top-full z-20 mt-2 w-24 overflow-hidden rounded-md border border-white/10 bg-[#14112E] shadow-lg">
                {ENTRIES_OPTIONS.map((option) => (
                  <button key={option} type="button" onClick={() => { setEntriesPerPage(option); setShowEntriesDropdown(false); }} className="block w-full px-3 py-2 text-left text-sm text-white/80 hover:bg-white/10">
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

export default CompanyManagementHome;
