import React, { useEffect, useMemo, useState } from 'react';
import { ChevronDown, ChevronLeft, ChevronRight, Eye, Pencil, Plus, Search, Trash2 } from 'lucide-react';
import AddAgent from './AddAgent';
import ViewAgent from './ViewAgent';
import type { Agent, EditableAgent } from './mockData';
import { sampleAgents } from './mockData';

const ENTRIES_OPTIONS = [8, 16, 24];
const STORAGE_KEY = 'agent_list_v1';

const mapEditableToAgent = (agent: EditableAgent, index: number): Agent => ({
  id: index + 1,
  apiId: agent.id,
  name: `${agent.firstName} ${agent.lastName}`.trim(),
  designation: agent.designation,
  mobile: agent.mobileNumber,
  email: agent.emailId,
  location: agent.office,
  avatar: '/avatar.jpg',
  verified: index % 3 === 0 ? 'blue' : index % 3 === 1 ? 'orange' : 'red',
  online: index % 2 === 0,
  source: agent,
});

const AgentManagementHome: React.FC = () => {
  const [search, setSearch] = useState('');
  const [entriesPerPage, setEntriesPerPage] = useState(8);
  const [currentPage, setCurrentPage] = useState(1);
  const [showEntriesDropdown, setShowEntriesDropdown] = useState(false);
  const [showAddAgent, setShowAddAgent] = useState(false);
  const [editingAgent, setEditingAgent] = useState<EditableAgent | null>(null);
  const [viewingAgent, setViewingAgent] = useState<Agent | null>(null);
  const [agents, setAgents] = useState<Agent[]>([]);

  useEffect(() => {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      try {
        const parsed = JSON.parse(raw) as Agent[];
        if (Array.isArray(parsed) && parsed.length > 0) {
          setAgents(parsed);
          return;
        }
      } catch {}
    }

    setAgents(sampleAgents);
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(agents));
  }, [agents]);

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return agents;

    return agents.filter(
      (agent) =>
        agent.name.toLowerCase().includes(query) ||
        agent.email.toLowerCase().includes(query) ||
        agent.designation.toLowerCase().includes(query) ||
        agent.location.toLowerCase().includes(query)
    );
  }, [agents, search]);

  useEffect(() => {
    setCurrentPage(1);
  }, [search, entriesPerPage]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / entriesPerPage));
  const paginatedAgents = filtered.slice((currentPage - 1) * entriesPerPage, currentPage * entriesPerPage);

  const getPageNumbers = () => {
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
  };

  const handleDeleteAgent = (agent: Agent) => {
    if (!window.confirm(`Delete ${agent.name}?`)) return;
    setAgents((prev) => prev.filter((item) => item.id !== agent.id));
  };

  if (showAddAgent) {
    return (
      <div className="space-y-4">
        <button type="button" onClick={() => setShowAddAgent(false)} className="text-sm text-white/80 hover:text-white">
          ← Back to Agent Management
        </button>
        <AddAgent
          onSuccess={(agent) => {
            setAgents((prev) => [...prev, mapEditableToAgent(agent, prev.length)]);
            setShowAddAgent(false);
          }}
          onDiscard={() => setShowAddAgent(false)}
        />
      </div>
    );
  }

  if (editingAgent) {
    return (
      <div className="space-y-4">
        <button type="button" onClick={() => setEditingAgent(null)} className="text-sm text-white/80 hover:text-white">
          ← Back to Agent Management
        </button>
        <AddAgent
          editAgent={editingAgent}
          onSuccess={(agent) => {
            setAgents((prev) =>
              prev.map((item) => (item.apiId === editingAgent.id ? { ...item, ...mapEditableToAgent(agent, item.id - 1), id: item.id } : item))
            );
            setEditingAgent(null);
          }}
          onDiscard={() => setEditingAgent(null)}
        />
      </div>
    );
  }

  if (viewingAgent) {
    return (
      <div className="space-y-4">
        <button type="button" onClick={() => setViewingAgent(null)} className="text-sm text-white/80 hover:text-white">
          ← Back to Agent Management
        </button>
        <ViewAgent agent={viewingAgent} />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
        <div>
          <h1 className="text-[30px] font-semibold leading-none text-white">Agent Management</h1>
          <p className="mt-3 text-sm text-white/80">Manage all of your Agents here.</p>
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
            Agent Type ▾
          </button>

          <button
            type="button"
            onClick={() => setShowAddAgent(true)}
            className="inline-flex h-12 items-center gap-3 bg-[#F68E2D] px-4 text-sm font-medium text-white"
          >
            <Plus className="h-4 w-4" />
            Add Agent
          </button>
        </div>
      </div>

      <div className="overflow-hidden border border-[#8A91AC] bg-[#14112E]">
        <div className="overflow-x-auto overflow-y-hidden pb-2">
          <table className="min-w-225 w-full table-fixed border-separate border-spacing-0">
            <colgroup>
              <col className="w-[8%]" />
              <col className="w-[20%]" />
              <col className="w-[16%]" />
              <col className="w-[14%]" />
              <col className="w-[20%]" />
              <col className="w-[10%]" />
              <col className="w-[12%]" />
            </colgroup>
            <thead>
              <tr className="border-b border-[#8A91AC] text-sm font-semibold text-white">
                <th className="border-r border-[#8A91AC] px-4 py-3 text-center">Image</th>
                <th className="border-r border-[#8A91AC] px-4 py-3 text-center">Name</th>
                <th className="border-r border-[#8A91AC] px-4 py-3 text-center">Designation</th>
                <th className="border-r border-[#8A91AC] px-4 py-3 text-center">Mobile Number</th>
                <th className="border-r border-[#8A91AC] px-4 py-3 text-center">Email</th>
                <th className="border-r border-[#8A91AC] px-4 py-3 text-center">Location</th>
                <th className="px-4 py-3 text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {paginatedAgents.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-10 text-center text-white/75">
                    No agents found.
                  </td>
                </tr>
              ) : (
                paginatedAgents.map((agent) => (
                  <tr key={agent.id} className="text-sm text-white/90">
                    <td className="border-r border-b border-[#6A708D] px-4 py-4 text-center">
                      <div className="relative mx-auto flex h-10 w-10 items-center justify-center overflow-hidden rounded-full border border-white/20 bg-white text-[10px] font-bold text-[#1B153D]">
                        <img src={agent.avatar} alt={agent.name} className="h-full w-full object-cover" />
                        <span className={`absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-[#14112E] ${agent.online ? 'bg-green-500' : 'bg-red-500'}`} />
                      </div>
                    </td>
                    <td className="border-r border-b border-[#6A708D] px-4 py-4 text-center">
                      <div className="flex items-center justify-center gap-1 text-white">
                        {agent.name}
                        <span className={`flex h-4 w-4 items-center justify-center rounded-full ${agent.verified === 'blue' ? 'bg-[#3B82F6]' : agent.verified === 'orange' ? 'bg-[#F68E2D]' : 'bg-[#E03137]'}`}>
                          <svg className="h-2.5 w-2.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414L8 15.414l-4.707-4.707a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </span>
                      </div>
                    </td>
                    <td className="border-r border-b border-[#6A708D] whitespace-nowrap px-4 py-4 text-center">{agent.designation}</td>
                    <td className="border-r border-b border-[#6A708D] whitespace-nowrap px-4 py-4 text-center">{agent.mobile}</td>
                    <td className="border-r border-b border-[#6A708D] whitespace-nowrap px-4 py-4 text-center">{agent.email}</td>
                    <td className="border-r border-b border-[#6A708D] whitespace-nowrap px-4 py-4 text-center">{agent.location}</td>
                    <td className="border-b border-[#6A708D] px-4 py-4 whitespace-nowrap text-center">
                      <div className="flex flex-nowrap items-center justify-center gap-2">
                        <button
                          type="button"
                          onClick={() => setViewingAgent(agent)}
                          className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#F68E2D] transition-colors hover:bg-[#e57d1f]"
                          aria-label="View"
                        >
                          <Eye className="h-3.5 w-3.5 text-white" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setEditingAgent(agent.source)}
                          className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#3F5AE6] transition-colors hover:bg-[#334bd0]"
                          aria-label="Edit"
                        >
                          <Pencil className="h-3.5 w-3.5 text-white" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteAgent(agent)}
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
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="flex h-7 w-7 items-center justify-center rounded-lg border border-white/60 text-white disabled:opacity-40"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>

          {getPageNumbers().map((page, idx) =>
            typeof page === 'number' ? (
              <button
                key={`${page}-${idx}`}
                type="button"
                onClick={() => setCurrentPage(page)}
                className={`flex h-7 w-7 items-center justify-center rounded-lg font-medium ${page === currentPage ? 'bg-[#F68E2D] text-white' : 'text-white/90'}`}
              >
                {page}
              </button>
            ) : (
              <span key={`${page}-${idx}`} className="px-1 text-white/80">
                {page}
              </span>
            )
          )}

          <button
            type="button"
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="flex h-7 w-7 items-center justify-center rounded-lg border border-white/60 text-white disabled:opacity-40"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs text-white/70">
            Showing {filtered.length === 0 ? 0 : (currentPage - 1) * entriesPerPage + 1} to {Math.min(currentPage * entriesPerPage, filtered.length)} of {filtered.length} entries
          </span>
          <div className="relative">
            <button type="button" onClick={() => setShowEntriesDropdown((v) => !v)} className="inline-flex h-9 items-center gap-2 rounded bg-[#F3F4F6] px-3 text-xs text-black">
              Show {entriesPerPage}
              <ChevronDown className="h-3 w-3" />
            </button>

            {showEntriesDropdown && (
              <div className="absolute right-0 top-full z-10 mt-1 min-w-20 overflow-hidden rounded bg-white shadow-md">
                {ENTRIES_OPTIONS.map((opt) => (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => {
                      setEntriesPerPage(opt);
                      setShowEntriesDropdown(false);
                    }}
                    className={`block w-full px-4 py-2 text-left text-sm ${entriesPerPage === opt ? 'bg-[#F7941D] text-white' : 'text-gray-800 hover:bg-gray-100'}`}
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

export default AgentManagementHome;
