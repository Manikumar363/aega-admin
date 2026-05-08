import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface Enquiry {
  id: string;
  name: string;
  mobileNumber: string;
  email: string;
  subject: string;
}

export const EnquiriesPage: React.FC = () => {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const itemsPerPage = 8;

  const enquiries: Enquiry[] = [
    { id: '0000001', name: 'Liam', mobileNumber: '5506555340', email: 'liam@gmail.com', subject: 'Subject' },
    { id: '0000002', name: 'Mason', mobileNumber: '9876543210', email: 'mason@gmail.com', subject: 'Subject' },
    { id: '0000003', name: 'Liam', mobileNumber: '6543217890', email: 'liam@gmail.com', subject: 'Subject' },
    { id: '0000004', name: 'Liam', mobileNumber: '7890123456', email: 'liam@gmail.com', subject: 'Subject' },
    { id: '0000005', name: 'Mason', mobileNumber: '1234567890', email: 'mason@gmail.com', subject: 'Subject' },
    { id: '0000006', name: 'Mason', mobileNumber: '4567890123', email: 'mason@gmail.com', subject: 'Subject' },
    { id: '0000007', name: 'Liam', mobileNumber: '9876504321', email: 'liam@gmail.com', subject: 'Subject' },
    { id: '0000008', name: 'James', mobileNumber: '2345678901', email: 'james@gmail.com', subject: 'Subject' },
    { id: '0000009', name: 'Sarah', mobileNumber: '3456789012', email: 'sarah@email.com', subject: 'Subject' },
    { id: '0000010', name: 'Michael', mobileNumber: '4567890123', email: 'michael@domain.com', subject: 'Subject' },
  ];

  const filteredEnquiries = enquiries.filter(
    (enquiry) =>
      enquiry.id.includes(searchTerm) ||
      enquiry.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      enquiry.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredEnquiries.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedEnquiries = filteredEnquiries.slice(startIndex, startIndex + itemsPerPage);

  const handleMessageClick = (enquiry: Enquiry) => {
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
                <th className="px-4 py-3 text-left text-sm font-semibold text-white">Eng ID</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-white">Name</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-white">Mobile Number</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-white">Email</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-white">Subject</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-white">Action</th>
              </tr>
            </thead>
            <tbody>
              {paginatedEnquiries.map((enquiry) => (
                <tr
                  key={enquiry.id}
                  className="border-b border-white/20 hover:bg-white/5 transition"
                >
                  <td className="px-4 py-3 text-sm text-white">{enquiry.id}</td>
                  <td className="px-4 py-3 text-sm text-white">{enquiry.name}</td>
                  <td className="px-4 py-3 text-sm text-white">{enquiry.mobileNumber}</td>
                  <td className="px-4 py-3 text-sm text-white">{enquiry.email}</td>
                  <td className="px-4 py-3 text-sm text-white">{enquiry.subject}</td>
                  <td className="px-4 py-3 text-sm">
                    <div className="flex items-center gap-2">
                      <button
                        className="p-2 rounded-lg bg-[#F68E2D] text-white hover:bg-[#F68E2D]/80 transition"
                        title="View"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      </button>
                      <button
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
              ))}
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
            Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredEnquiries.length)} of {filteredEnquiries.length} entries
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
