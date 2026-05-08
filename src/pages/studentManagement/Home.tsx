import React, { useEffect, useMemo, useState } from 'react';
import { ChevronDown, ChevronLeft, ChevronRight, Eye, Pencil, Plus, Search, Trash2 } from 'lucide-react';
import AddStudent from './AddStudent';
import ViewStudent from './ViewStudent';
import type { Student } from './mockData';
import { sampleStudents } from './mockData';

const ENTRIES_OPTIONS = [8, 16, 24];
const STORAGE_KEY = 'student_list_v1';

const StudentManagementHome: React.FC = () => {
  const [search, setSearch] = useState('');
  const [entriesPerPage, setEntriesPerPage] = useState(8);
  const [currentPage, setCurrentPage] = useState(1);
  const [showEntriesDropdown, setShowEntriesDropdown] = useState(false);
  const [showAddStudent, setShowAddStudent] = useState(false);
  const [viewingStudent, setViewingStudent] = useState<Student | null>(null);
  const [students, setStudents] = useState<Student[]>([]);

  useEffect(() => {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      try {
        const parsed = JSON.parse(raw) as Student[];
        if (Array.isArray(parsed) && parsed.length > 0) {
          setStudents(parsed);
          return;
        }
      } catch {}
    }

    setStudents(sampleStudents);
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(students));
  }, [students]);

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return students;

    return students.filter(
      (student) =>
        student.name.toLowerCase().includes(query) ||
        student.email.toLowerCase().includes(query) ||
        student.program.toLowerCase().includes(query) ||
        student.location.toLowerCase().includes(query)
    );
  }, [search, students]);

  useEffect(() => {
    setCurrentPage(1);
  }, [search, entriesPerPage]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / entriesPerPage));
  const startIndex = (currentPage - 1) * entriesPerPage;
  const paginatedStudents = filtered.slice(startIndex, startIndex + entriesPerPage);

  const pageNumbers = (() => {
    const pages: (number | string)[] = [];
    if (totalPages <= 5) {
      for (let page = 1; page <= totalPages; page += 1) pages.push(page);
      return pages;
    }

    pages.push(1);
    const start = Math.max(2, currentPage - 1);
    const end = Math.min(totalPages - 1, currentPage + 1);
    if (start > 2) pages.push('...');
    for (let page = start; page <= end; page += 1) pages.push(page);
    if (end < totalPages - 1) pages.push('...');
    pages.push(totalPages);
    return pages;
  })();

  const handleDeleteStudent = (student: Student) => {
    if (!window.confirm(`Delete ${student.name}?`)) return;
    setStudents((prev) => prev.filter((item) => item.id !== student.id));
  };

  if (showAddStudent) {
    return (
      <div className="space-y-4">
        <button type="button" onClick={() => setShowAddStudent(false)} className="text-sm text-white/80 hover:text-white">
          ← Back to Student Management
        </button>
        <AddStudent onClose={() => setShowAddStudent(false)} />
      </div>
    );
  }

  if (viewingStudent) {
    return (
      <div className="space-y-4">
        <button type="button" onClick={() => setViewingStudent(null)} className="text-sm text-white/80 hover:text-white">
          ← Back to Student Management
        </button>
        <ViewStudent student={viewingStudent} />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
        <div>
          <h1 className="text-[30px] font-semibold leading-none text-white">Student Management</h1>
          <p className="mt-3 text-sm text-white/80">Manage all of your Students here.</p>
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
            <Search className="pointer-events-none absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#0F1A36]" />
          </div>

          <button className="inline-flex h-12 items-center gap-3 bg-[#F68E2D] px-4 text-sm font-medium text-white">
            Student Type ▾
          </button>

          <button
            type="button"
            onClick={() => setShowAddStudent(true)}
            className="inline-flex h-12 items-center gap-3 bg-[#F68E2D] px-4 text-sm font-medium text-white"
          >
            <Plus className="h-4 w-4" />
            Add Student
          </button>
        </div>
      </div>

      <div className="overflow-hidden border border-[#8A91AC] bg-[#14112E]">
        <div className="overflow-x-auto overflow-y-hidden pb-2">
          <table className="min-w-225 w-full table-fixed border-separate border-spacing-0">
            <colgroup>
              <col className="w-[8%]" />
              <col className="w-[22%]" />
              <col className="w-[16%]" />
              <col className="w-[16%]" />
              <col className="w-[18%]" />
              <col className="w-[10%]" />
              <col className="w-[12%]" />
            </colgroup>
            <thead>
              <tr className="border-b border-[#8A91AC] text-sm font-semibold text-white">
                <th className="border-r border-[#8A91AC] px-4 py-3 text-center">Image</th>
                <th className="border-r border-[#8A91AC] px-4 py-3 text-center">Student Name</th>
                <th className="border-r border-[#8A91AC] px-4 py-3 text-center">Program</th>
                <th className="border-r border-[#8A91AC] px-4 py-3 text-center">Mobile Number</th>
                <th className="border-r border-[#8A91AC] px-4 py-3 text-center">Email</th>
                <th className="border-r border-[#8A91AC] px-4 py-3 text-center">Location</th>
                <th className="px-4 py-3 text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {paginatedStudents.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-10 text-center text-white/75">
                    No students found.
                  </td>
                </tr>
              ) : (
                paginatedStudents.map((student) => (
                  <tr key={student.id} className="text-sm text-white/95">
                    <td className="border-r border-b border-[#6A708D] px-6 py-4">
                      <div className="relative flex justify-center">
                        <img
                          src={student.avatar}
                          alt={student.name}
                          className="h-8 w-8 rounded-full border border-white/20 object-cover"
                        />
                        <span
                          className={`absolute -bottom-0.5 right-[calc(50%-16px)] translate-x-4 h-2.5 w-2.5 rounded-full border border-white ${
                            student.online ? 'bg-[#32D74B]' : 'bg-[#A0A0A0]'
                          }`}
                        />
                      </div>
                    </td>
                    <td className="border-r border-b border-[#6A708D] whitespace-nowrap px-6 py-4 text-center">{student.name}</td>
                    <td className="border-r border-b border-[#6A708D] whitespace-nowrap px-6 py-4 text-center">{student.program}</td>
                    <td className="border-r border-b border-[#6A708D] whitespace-nowrap px-6 py-4 text-center">{student.mobile}</td>
                    <td className="border-r border-b border-[#6A708D] whitespace-nowrap px-6 py-4 text-center">{student.email}</td>
                    <td className="border-r border-b border-[#6A708D] whitespace-nowrap px-6 py-4 text-center">{student.location}</td>
                    <td className="border-b border-[#6A708D] px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-nowrap items-center justify-center gap-2">
                        <button
                          type="button"
                          onClick={() => setViewingStudent(student)}
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
                          onClick={() => handleDeleteStudent(student)}
                          className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#ED3941] transition-colors hover:bg-[#d1323a]"
                          aria-label="Delete"
                        >
                          <Trash2 className="h-3.5 w-3.5 text-white" />
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
                {ENTRIES_OPTIONS.map((opt) => (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => {
                      setEntriesPerPage(opt);
                      setShowEntriesDropdown(false);
                    }}
                    className={`block w-full px-4 py-2 text-left text-sm ${
                      entriesPerPage === opt ? 'bg-[#F7941D] text-white' : 'text-gray-800 hover:bg-gray-100'
                    }`}
                  >
                    {opt}
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

export default StudentManagementHome;
