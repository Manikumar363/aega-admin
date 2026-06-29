import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createCDPCourse } from '../services/cdpTrainingApi';
import { toast } from 'react-toastify';

const AddCDPTraining: React.FC = () => {
  const [courseName, setCourseName] = useState('');
  const [type, setType] = useState<'mandatory' | 'optional'>('mandatory');
  const [timeInHr, setTimeInHr] = useState('');
  const [modules, setModules] = useState('');
  const [hyperLink, setHyperLink] = useState('');
  const [description, setDescription] = useState('');
  const [coverPicture, setCoverPicture] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleAdd = async () => {
    if (!courseName || !timeInHr || !modules || !hyperLink || !description) {
      setError('Please fill in all required fields');
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      await createCDPCourse({
        courseName,
        type,
        timeInHr: Number(timeInHr),
        modules: Number(modules),
        hyperLink,
        description,
        coverPicture,
      });

      toast.success('CDP Course added successfully');
      navigate('/cdp');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to create course';
      setError(message);
      toast.error(message);
      console.error('Error creating course:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 text-white">
      <div>
        <h1 className="text-2xl font-bold">CDP Training</h1>
        <p className="mt-2 text-sm text-white/70">Manage all of your CDP Training from here.</p>
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
            disabled={loading}
          />
        </div>
        <div>
          <label className="block mb-2 text-sm font-medium">Type *</label>
          <select 
            value={type} 
            onChange={(e) => setType(e.target.value as any)} 
            className="w-full border border-white/10 bg-transparent px-4 py-3 text-white"
            disabled={loading}
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
            disabled={loading}
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
            disabled={loading}
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
            disabled={loading}
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
            disabled={loading}
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
            disabled={loading}
          />
        </div>
      </div>

      <div className="mt-6 flex justify-center gap-6">
        <button 
          onClick={() => navigate('/cdp')} 
          className="min-w-45 border border-[#F68E2D] bg-white px-6 py-3 text-sm font-medium text-[#B8BDC7]"
          disabled={loading}
        >
          Discard
        </button>
        <button 
          onClick={handleAdd} 
          className="min-w-45 bg-[#F68E2D] px-6 py-3 text-sm font-semibold text-white disabled:opacity-50"
          disabled={loading}
        >
          {loading ? 'Adding...' : 'Add Course'}
        </button>
      </div>
    </div>
  );
};

export default AddCDPTraining;
