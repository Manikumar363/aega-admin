import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchCDPCourses, deleteCDPCourse, fetchTargetUserCDPProgress } from '../services/cdpTrainingApi';
import type { CDPCourse, CDPCourseProgress } from '../services/cdpTrainingApi';
import { Eye, Pencil, Trash2 } from 'lucide-react';
import { toast } from 'react-toastify';

interface CDPTrainingProps {
  targetType?: 'agent' | 'university' | 'company';
  targetId?: string;
}

const CDPTraining: React.FC<CDPTrainingProps> = ({ targetType, targetId }) => {
  const [courses, setCourses] = useState<CDPCourse[]>([]);
  const [progressList, setProgressList] = useState<CDPCourseProgress[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const isProfileMode = Boolean(targetType && targetId);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);
        if (isProfileMode) {
          const data = await fetchTargetUserCDPProgress(targetType!, targetId!);
          setProgressList(data);
        } else {
          const data = await fetchCDPCourses();
          setCourses(data);
        }
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to load CDP data';
        setError(message);
        console.error('Error loading CDP data:', err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [targetType, targetId, isProfileMode]);

  const filteredCourses = courses.filter(
    (c) =>
      c.courseName.toLowerCase().includes(search.toLowerCase()) ||
      c.description?.toLowerCase().includes(search.toLowerCase())
  );

  const filteredProgress = progressList.filter(
    (p) =>
      p.courseId?.courseName?.toLowerCase().includes(search.toLowerCase()) ||
      p.courseId?.description?.toLowerCase().includes(search.toLowerCase())
  );

  const handleDelete = async (courseId: string | number | undefined) => {
    if (!courseId) {
      toast.error('Invalid course ID');
      return;
    }
    if (window.confirm('Are you sure you want to delete this course?')) {
      try {
        await deleteCDPCourse(String(courseId));
        setCourses(courses.filter((c) => (c._id || c.id) !== courseId));
        toast.success('CDP Course deleted successfully');
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to delete course';
        toast.error(message);
        console.error('Error deleting course:', err);
      }
    }
  };

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return 'N/A';
    return new Date(dateStr).toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getStatusBadgeStyle = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-500/10 text-green-400 border border-green-500/20';
      case 'due':
        return 'bg-red-500/10 text-red-400 border border-red-500/20';
      default:
        return 'bg-yellow-500/10 text-yellow-500 border border-yellow-500/20';
    }
  };

  if (loading) {
    return (
      <div className="space-y-6 text-white">
        <div>
          <h1 className="text-2xl font-bold">
            {isProfileMode ? 'CDP Training Progress' : 'CDP Training Management'}
          </h1>
          <p className="mt-2 text-sm text-white/70">
            {isProfileMode
              ? 'View registered course progress and completion status.'
              : 'Manage all of your CDP Training from here.'}
          </p>
        </div>
        <div className="text-center py-8">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6 text-white">
        <div>
          <h1 className="text-2xl font-bold">
            {isProfileMode ? 'CDP Training Progress' : 'CDP Training Management'}
          </h1>
          <p className="mt-2 text-sm text-white/70">
            {isProfileMode
              ? 'View registered course progress and completion status.'
              : 'Manage all of your CDP Training from here.'}
          </p>
        </div>
        <div className="text-center py-8 text-red-500">Error: {error}</div>
      </div>
    );
  }

  // Profile View mode (Registered Course Progress list only)
  if (isProfileMode) {
    return (
      <div className="space-y-6 text-white animate-fadeIn">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">CDP Training Progress</h1>
            <p className="mt-2 text-sm text-white/70">
              View registered course progress and completion status.
            </p>
          </div>
          {progressList.length > 0 && (
            <div className="relative w-72">
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search registered courses..."
                className="w-full border border-white/20 bg-transparent px-4 py-3 text-sm text-white placeholder:text-white/40 outline-none"
              />
            </div>
          )}
        </div>

        {progressList.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded border border-white/10 bg-[#0D0B1A] py-16 text-center">
            <p className="text-lg font-medium text-white/60">No registered courses found</p>
            <p className="mt-1 text-sm text-white/40">
              This user has not registered for any CDP training courses yet.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full table-fixed border-collapse">
              <thead>
                <tr className="bg-[#0D0B1A]">
                  <th className="px-4 py-3 text-left text-sm text-white/80 w-16">SI No.</th>
                  <th className="px-4 py-3 text-left text-sm text-white/80 w-1/3">Course Name</th>
                  <th className="px-4 py-3 text-left text-sm text-white/80 w-28">Type</th>
                  <th className="px-4 py-3 text-left text-sm text-white/80">Progress</th>
                  <th className="px-4 py-3 text-left text-sm text-white/80 w-32">Status</th>
                  <th className="px-4 py-3 text-left text-sm text-white/80 w-36">Enrollment Date</th>
                  <th className="px-4 py-3 text-left text-sm text-white/80 w-36">Due Date</th>
                </tr>
              </thead>
              <tbody>
                {filteredProgress.map((p, idx) => (
                  <tr key={p._id} className="border-b border-white/10 hover:bg-white/5 transition-colors">
                    <td className="px-4 py-4 text-sm">{idx + 1}</td>
                    <td className="px-4 py-4 text-sm font-medium">
                      {p.courseId?.courseName || p.courseId?.name || 'Unknown Course'}
                    </td>
                    <td className="px-4 py-4 text-sm capitalize">{p.courseId?.type || 'mandatory'}</td>
                    <td className="px-4 py-4 text-sm">
                      <div className="flex items-center gap-3">
                        <div className="w-24 bg-white/10 h-2 rounded-full overflow-hidden">
                          <div
                            className="bg-[#F68E2D] h-full rounded-full transition-all duration-300"
                            style={{ width: `${p.progress || 0}%` }}
                          />
                        </div>
                        <span className="text-xs text-white/70">{p.progress || 0}%</span>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-sm">
                      <span className={`inline-block px-2.5 py-1 text-xs font-semibold rounded uppercase tracking-wider ${getStatusBadgeStyle(p.status)}`}>
                        {p.status}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-sm">{formatDate(p.enrollmentDate || p.startDate)}</td>
                    <td className="px-4 py-4 text-sm">{formatDate(p.dueDate)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    );
  }

  // Global Management Mode
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
            {filteredCourses.map((c, idx) => (
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
                      <Eye className="h-3.5 w-3.5 text-white" />
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
                      <Trash2 className="h-3.5 w-3.5 text-white" />
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
