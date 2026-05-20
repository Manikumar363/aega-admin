import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchAdminComplaints } from '../services/complaintsApi';
import type { EnquiryRecord } from '../services/complaintsApi';

export const EnquiriesPage: React.FC = () => {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [enquiries, setEnquiries] = useState<EnquiryRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const itemsPerPage = 8;

  useEffect(() => {
    let isActive = true;

    const loadEnquiries = async () => {
      setIsLoading(true);
      setError('');

      try {
        const records = await fetchAdminComplaints();
        if (isActive) {
          setEnquiries(records);
        }
      } catch (fetchError) {
        if (isActive) {
          setError(fetchError instanceof Error ? fetchError.message : 'Failed to load enquiries');
          setEnquiries([]);
        }
      } finally {
        if (isActive) {
          setIsLoading(false);
        }
      }
    };

    void loadEnquiries();

    return () => {
      isActive = false;
    };
  }, []);

  const filteredEnquiries = useMemo(
    () => enquiries.filter(
    (enquiry) =>
      enquiry.id.includes(searchTerm) ||
      enquiry.referenceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      enquiry.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      enquiry.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      enquiry.subject.toLowerCase().includes(searchTerm.toLowerCase())
  ), [enquiries, searchTerm]);

  const totalPages = Math.ceil(filteredEnquiries.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedEnquiries = filteredEnquiries.slice(startIndex, startIndex + itemsPerPage);

  const handleMessageClick = (enquiry: EnquiryRecord) => {
    navigate(`/enquiries/${enquiry.id}`);
  };

  const handleViewClick = (enquiry: EnquiryRecord) => {
    navigate(`/enquiries/${enquiry.id}`);
  };

  return (
    <div className="space-y-3 text-white">
      {/* Header Section */}
      <div>
        <h1 className="text-4xl font-bold">Enquiry Management</h1>
        <p className="mt-2 text-white/60">Manage all of your Enquiries from here.</p>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <input
          type="text"
          placeholder="Search"
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(1);
          }}
          className="w-full rounded-lg bg-white/5 px-4 py-2 text-white placeholder-white/40 border border-white/20 focus:outline-none focus:border-[#F68E2D]/60 focus:bg-white/10 transition"
        />
        <svg
          className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>

      {/* Table */}
      <div className="rounded-lg border border-white/20 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/20 bg-transparent">
                <th className="px-4 py-3 text-left text-sm font-semibold text-white">Ref No.</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-white">Name</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-white">Mobile Number</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-white">Email</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-white">Subject</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-white">Status</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-white">Action</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td className="px-4 py-8 text-sm text-white/60" colSpan={7}>
                    Loading enquiries...
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td className="px-4 py-8 text-sm text-[#FF7A7A]" colSpan={7}>
                    {error}
                  </td>
                </tr>
              ) : paginatedEnquiries.length === 0 ? (
                <tr>
                  <td className="px-4 py-8 text-sm text-white/60" colSpan={7}>
                    No enquiries found.
                  </td>
                </tr>
              ) : (
                paginatedEnquiries.map((enquiry) => (
                  <tr
                    key={enquiry.id}
                    className="border-b border-white/20 hover:bg-white/5 transition"
                  >
                    <td className="px-4 py-3 text-sm text-white">{enquiry.referenceNumber}</td>
                    <td className="px-4 py-3 text-sm text-white">{enquiry.name}</td>
                    <td className="px-4 py-3 text-sm text-white">{enquiry.mobileNumber}</td>
                    <td className="px-4 py-3 text-sm text-white">{enquiry.email}</td>
                    <td className="px-4 py-3 text-sm text-white">{enquiry.subject}</td>
                    <td className="px-4 py-3 text-sm text-white capitalize">{enquiry.status}</td>
                    <td className="px-4 py-3 text-sm">
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          className="p-2 rounded-lg bg-[#F68E2D] text-white hover:bg-[#F68E2D]/80 transition"
                          title="View"
                          onClick={() => handleViewClick(enquiry)}
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                        </button>
                        <button
                          type="button"
                          className="p-2 rounded-lg bg-[#6366F1] text-white hover:bg-[#6366F1]/80 transition"
                          title="Message"
                          onClick={() => handleMessageClick(enquiry)}
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between border-t border-white/20 px-4 py-3">
          <div className="flex items-center gap-1">
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 rounded text-white disabled:opacity-30 hover:bg-white/10"
            >
              ‹
            </button>
            {Array.from({ length: Math.min(totalPages, 5) }).map((_, i) => {
              const pageNum = i + 1;
              return (
                <button
                  key={pageNum}
                  onClick={() => setCurrentPage(pageNum)}
                  className={`w-8 h-8 rounded text-sm font-medium transition ${
                    currentPage === pageNum
                      ? 'bg-[#F68E2D] text-white'
                      : 'text-white hover:bg-white/10'
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}
            {totalPages > 5 && <span className="text-white/60 px-2">...</span>}
            <button
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className="px-3 py-1 rounded text-white disabled:opacity-30 hover:bg-white/10"
            >
              ›
            </button>
          </div>
          <div className="text-sm text-white/60">
            Showing {filteredEnquiries.length === 0 ? 0 : startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredEnquiries.length)} of {filteredEnquiries.length} entries
            <button className="ml-4 px-3 py-1 rounded border border-white/20 text-white hover:bg-white/10 text-xs">
              Show 8
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnquiriesPage;
