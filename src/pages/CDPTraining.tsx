import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { EditIcon } from '../components/ui/icons';

interface Course {
  id: number;
  name: string;
  for: 'University' | 'Agents';
  type: 'Standard' | 'Recommended';
  modules: number;
  time: string;
}

const sampleCourses: Course[] = Array.from({ length: 10 }).map((_, i) => ({
  id: i + 1,
  name: `Course ${i + 1}`,
  for: i % 2 === 0 ? 'University' : 'Agents',
  type: i % 3 === 0 ? 'Recommended' : 'Standard',
  modules: (i % 5) + 1,
  time: '16 hr',
}));

const STORAGE_KEY = 'cdpCourses';

const CDPTraining: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      try {
        setCourses(JSON.parse(raw));
        return;
      } catch {}
    }
    setCourses(sampleCourses);
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(courses));
  }, [courses]);

  const filtered = courses.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.for.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 text-white">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">CDP Training Management</h1>
          <p className="mt-2 text-sm text-white/70">Manage all of your CDP Training from here.</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="relative w-72">
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search"
              className="w-full border border-white/20 bg-transparent px-4 py-3 text-sm text-white placeholder:text-white/40 outline-none"
            />
          </div>
          <button
            onClick={() => navigate('/cdp/add')}
            className="flex items-center gap-2 bg-[#F68E2D] px-6 py-3 text-sm font-semibold text-white"
          >
            <span className="text-xl leading-none">+</span>
            Add
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full table-fixed border-collapse">
          <thead>
            <tr className="bg-[#0D0B1A]">
              <th className="px-4 py-3 text-left text-sm text-white/80 w-16">SI No.</th>
              <th className="px-4 py-3 text-left text-sm text-white/80">Course Name</th>
              <th className="px-4 py-3 text-left text-sm text-white/80 w-32">For</th>
              <th className="px-4 py-3 text-left text-sm text-white/80 w-32">Type</th>
              <th className="px-4 py-3 text-left text-sm text-white/80 w-28">Module Number</th>
              <th className="px-4 py-3 text-left text-sm text-white/80 w-24">Time</th>
              <th className="px-4 py-3 text-left text-sm text-white/80 w-32">Action</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((c) => (
              <tr key={c.id} className="border-b border-white/10">
                <td className="px-4 py-4 text-sm">{c.id}</td>
                <td className="px-4 py-4 text-sm">{c.name}</td>
                <td className="px-4 py-4 text-sm">{c.for}</td>
                <td className="px-4 py-4 text-sm">{c.type}</td>
                <td className="px-4 py-4 text-sm">{c.modules}</td>
                <td className="px-4 py-4 text-sm">{c.time}</td>
                <td className="px-4 py-4 text-sm">
                  <div className="flex items-center justify-end gap-3">
                    <button onClick={() => alert('View not implemented')} className="h-8 w-8 rounded-full bg-[#F68E2D] text-white" />
                    <button onClick={() => navigate(`/cdp/edit/${c.id}`)} className="h-8 w-8 rounded-full bg-[#3B53D7] text-white flex items-center justify-center">
                      <EditIcon />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CDPTraining;
