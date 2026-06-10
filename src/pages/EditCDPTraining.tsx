import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getCDPCourseById, updateCDPCourse } from '../services/cdpTrainingApi';

const EditCDPTraining: React.FC = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const [courseName, setCourseName] = useState('');
  const [type, setType] = useState<'mandatory' | 'optional'>('mandatory');
  const [timeInHr, setTimeInHr] = useState('');
  const [modules, setModules] = useState('');
  const [hyperLink, setHyperLink] = useState('');
  const [description, setDescription] = useState('');
  const [coverPicture, setCoverPicture] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const loadCourse = async () => {
      if (!courseId) {
        setError('Course ID not found');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const course = await getCDPCourseById(courseId);
        
        setCourseName(course.courseName || '');
        setType((course.type as 'mandatory' | 'optional') || 'mandatory');
        setTimeInHr(String(course.timeInHr || ''));
        setModules(String(course.modules || ''));
        setHyperLink(course.hyperLink || '');
        setDescription(course.description || '');
        setCoverPicture(course.coverPicture || '');
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to load course';
        setError(message);
        console.error('Error loading course:', err);
      } finally {
        setLoading(false);
      }
    };

    loadCourse();
  }, [courseId]);

  const handleUpdate = async () => {
    if (!courseName || !timeInHr || !modules || !hyperLink || !description) {
      setError('Please fill in all required fields');
      return;
    }

    if (!courseId) {
      setError('Course ID not found');
      return;
    }

    try {
      setSaving(true);
      setError(null);

      await updateCDPCourse(courseId, {
        courseName,
        type,
        timeInHr: Number(timeInHr),
        modules: Number(modules),
        hyperLink,
        description,
        coverPicture,
      });

      navigate('/cdp');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to update course';
      setError(message);
      console.error('Error updating course:', err);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6 text-white">
        <div>
          <h1 className="text-2xl font-bold">Edit CDP Training</h1>
          <p className="mt-2 text-sm text-white/70">Edit your CDP Training course.</p>
        </div>
        <div className="text-center py-8">Loading...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6 text-white">
      <div>
        <h1 className="text-2xl font-bold">Edit CDP Training</h1>
        <p className="mt-2 text-sm text-white/70">Edit your CDP Training course.</p>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500 text-red-400 px-4 py-3 rounded">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div>
          <label className="block mb-2 text-sm font-medium">Course Name *</label>
          <input 
            value={courseName} 
            onChange={(e) => setCourseName(e.target.value)} 
            placeholder="Name" 
            className="w-full border border-white/10 bg-transparent px-4 py-3 text-white" 
            disabled={saving}
          />
        </div>
        <div>
          <label className="block mb-2 text-sm font-medium">Type *</label>
          <select 
            value={type} 
            onChange={(e) => setType(e.target.value as any)} 
            className="w-full border border-white/10 bg-transparent px-4 py-3 text-white"
            disabled={saving}
          >
            <option value="mandatory">Mandatory</option>
            <option value="optional">Optional</option>
          </select>
        </div>

        <div>
          <label className="block mb-2 text-sm font-medium">Time(in hr) *</label>
          <input 
            value={timeInHr} 
            onChange={(e) => setTimeInHr(e.target.value)} 
            placeholder="20" 
            type="number"
            className="w-full border border-white/10 bg-transparent px-4 py-3 text-white" 
            disabled={saving}
          />
        </div>
        <div>
          <label className="block mb-2 text-sm font-medium">Modules *</label>
          <input 
            value={modules} 
            onChange={(e) => setModules(e.target.value)} 
            placeholder="8" 
            type="number"
            className="w-full border border-white/10 bg-transparent px-4 py-3 text-white" 
            disabled={saving}
          />
        </div>

        <div>
          <label className="block mb-2 text-sm font-medium">Hyper Link *</label>
          <input 
            value={hyperLink} 
            onChange={(e) => setHyperLink(e.target.value)} 
            placeholder="https://example.com" 
            type="url"
            className="w-full border border-white/10 bg-transparent px-4 py-3 text-white" 
            disabled={saving}
          />
        </div>
        <div>
          <label className="block mb-2 text-sm font-medium">Cover Picture URL</label>
          <input 
            value={coverPicture} 
            onChange={(e) => setCoverPicture(e.target.value)} 
            placeholder="https://example.com/image.jpg" 
            type="url"
            className="w-full border border-white/10 bg-transparent px-4 py-3 text-white" 
            disabled={saving}
          />
        </div>

        <div className="md:col-span-2">
          <label className="block mb-2 text-sm font-medium">Description *</label>
          <textarea 
            value={description} 
            onChange={(e) => setDescription(e.target.value)} 
            rows={5} 
            placeholder="Description" 
            className="w-full border border-white/10 bg-transparent px-4 py-3 text-white" 
            disabled={saving}
          />
        </div>
      </div>

      <div className="mt-6 flex justify-center gap-6">
        <button 
          onClick={() => navigate('/cdp')} 
          className="min-w-45 border border-[#F68E2D] bg-white px-6 py-3 text-sm font-medium text-[#B8BDC7]"
          disabled={saving}
        >
          Cancel
        </button>
        <button 
          onClick={handleUpdate} 
          className="min-w-45 bg-[#F68E2D] px-6 py-3 text-sm font-semibold text-white disabled:opacity-50"
          disabled={saving}
        >
          {saving ? 'Updating...' : 'Update Course'}
        </button>
      </div>
    </div>
  );
};

export default EditCDPTraining;
