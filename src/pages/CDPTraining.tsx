import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchCDPCourses, deleteCDPCourse } from '../services/cdpTrainingApi';
import type { CDPCourse } from '../services/cdpTrainingApi';
import { Eye, Pencil, Trash2 } from 'lucide-react';

const CDPTraining: React.FC = () => {
  const [courses, setCourses] = useState<CDPCourse[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const loadCourses = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await fetchCDPCourses();
        setCourses(data);
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to load courses';
        setError(message);
        console.error('Error loading courses:', err);
      } finally {
        setLoading(false);
      }
    };

    loadCourses();
  }, []);

  const filtered = courses.filter(
    (c) =>
      c.courseName.toLowerCase().includes(search.toLowerCase()) ||
      c.description?.toLowerCase().includes(search.toLowerCase())
  );

  const handleDelete = async (courseId: string | number | undefined) => {
    if (!courseId) {
      alert('Invalid course ID');
      return;
    }
    if (window.confirm('Are you sure you want to delete this course?')) {
      try {
        await deleteCDPCourse(String(courseId));
        setCourses(courses.filter(c => (c._id || c.id) !== courseId));
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to delete course';
        alert(message);
        console.error('Error deleting course:', err);
      }
    }
  };

  if (loading) {
    return (
      <div className="space-y-6 text-white">
        <div>
          <h1 className="text-2xl font-bold">CDP Training Management</h1>
          <p className="mt-2 text-sm text-white/70">Manage all of your CDP Training from here.</p>
        </div>
        <div className="text-center py-8">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6 text-white">
        <div>
          <h1 className="text-2xl font-bold">CDP Training Management</h1>
          <p className="mt-2 text-sm text-white/70">Manage all of your CDP Training from here.</p>
        </div>
        <div className="text-center py-8 text-red-500">Error: {error}</div>
      </div>
    );
  }

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
            {filtered.map((c, idx) => (
              <tr key={c._id || c.id} className="border-b border-white/10">
                <td className="px-4 py-4 text-sm">{idx + 1}</td>
                <td className="px-4 py-4 text-sm">{c.courseName || c.name}</td>
                <td className="px-4 py-4 text-sm">{c.type}</td>
                <td className="px-4 py-4 text-sm">{c.type}</td>
                <td className="px-4 py-4 text-sm">{c.modules}</td>
                <td className="px-4 py-4 text-sm">{c.timeInHr || c.time}hr</td>
                <td className="px-4 py-4 text-sm">
                  <div className="flex flex-nowrap items-center justify-center gap-2">
                    <button 
                      type="button"
                      onClick={() => navigate(`/cdp/view/${c._id || c.id}`)}
                      className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#F7941D] transition-colors hover:bg-[#e28518]"
                      aria-label="View"
                    >
                      <Eye className="h-3.5 w-3.5 text-white"/>
                    </button>
                    <button 
                      type="button"
                      onClick={() => navigate(`/cdp/edit/${c._id || c.id}`)} 
                      className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#3F5AE6] transition-colors hover:bg-[#334bd0]"
                      aria-label="Edit"
                    >
                      <Pencil className="h-3.5 w-3.5 text-white" />
                    </button>
                    <button 
                      type="button"
                      onClick={() => handleDelete(c._id || c.id)}
                      className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#ED3941] transition-colors hover:bg-[#d1323a]"
                      aria-label="Delete"
                    >
                      <Trash2 className="h-3.5 w-3.5 text-white"/>
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
