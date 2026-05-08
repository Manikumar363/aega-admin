import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const STORAGE_KEY = 'cdpCourses';

const AddCDPTraining: React.FC = () => {
  const [name, setName] = useState('');
  const [type, setType] = useState<'Standard' | 'Recommended'>('Standard');
  const [time, setTime] = useState('');
  const [modules, setModules] = useState('');
  const [forTarget, setForTarget] = useState<'University' | 'Agents'>('University');
  const [link, setLink] = useState('');
  const [description, setDescription] = useState('');
  const navigate = useNavigate();

  const handleAdd = () => {
    const raw = localStorage.getItem(STORAGE_KEY);
    const list = raw ? JSON.parse(raw) : [];
    const nextId = list.length ? Math.max(...list.map((x: any) => x.id)) + 1 : 1;
    list.push({ id: nextId, name, for: forTarget, type, modules: Number(modules) || 0, time: `${time} hr`, link, description });
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
    navigate('/cdp');
  };

  return (
    <div className="space-y-6 text-white">
      <div>
        <h1 className="text-2xl font-bold">CDP Training</h1>
        <p className="mt-2 text-sm text-white/70">Manage all of your CDP Training from here.</p>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div>
          <label className="block mb-2 text-sm font-medium">Course Name *</label>
          <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Name" className="w-full border border-white/10 bg-transparent px-4 py-3 text-white" />
        </div>
        <div>
          <label className="block mb-2 text-sm font-medium">Type *</label>
          <select value={type} onChange={(e) => setType(e.target.value as any)} className="w-full border border-white/10 bg-transparent px-4 py-3 text-white">
            <option value="Standard">Standard</option>
            <option value="Recommended">Recommended</option>
          </select>
        </div>

        <div>
          <label className="block mb-2 text-sm font-medium">Time(in hr) *</label>
          <input value={time} onChange={(e) => setTime(e.target.value)} placeholder="20" className="w-full border border-white/10 bg-transparent px-4 py-3 text-white" />
        </div>
        <div>
          <label className="block mb-2 text-sm font-medium">Modules *</label>
          <input value={modules} onChange={(e) => setModules(e.target.value)} placeholder="8" className="w-full border border-white/10 bg-transparent px-4 py-3 text-white" />
        </div>

        <div>
          <label className="block mb-2 text-sm font-medium">For *</label>
          <select value={forTarget} onChange={(e) => setForTarget(e.target.value as any)} className="w-full border border-white/10 bg-transparent px-4 py-3 text-white">
            <option value="University">University</option>
            <option value="Agents">Agents</option>
          </select>
        </div>
        <div>
          <label className="block mb-2 text-sm font-medium">Hyper Link *</label>
          <input value={link} onChange={(e) => setLink(e.target.value)} placeholder="Link" className="w-full border border-white/10 bg-transparent px-4 py-3 text-white" />
        </div>

        <div className="md:col-span-2">
          <label className="block mb-2 text-sm font-medium">Description *</label>
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={5} placeholder="Description" className="w-full border border-white/10 bg-transparent px-4 py-3 text-white" />
        </div>

        <div className="md:col-span-2">
          <label className="block mb-2 text-sm font-medium">Cover Picture *</label>
          <div className="h-28 w-full rounded border border-dashed border-white/20 bg-[#15123A] flex items-center justify-center text-white/60">Upload Document</div>
        </div>
      </div>

      <div className="mt-6 flex justify-center gap-6">
        <button onClick={() => navigate('/cdp')} className="min-w-45 border border-[#F68E2D] bg-white px-6 py-3 text-sm font-medium text-[#B8BDC7]">Discard</button>
        <button onClick={handleAdd} className="min-w-45 bg-[#F68E2D] px-6 py-3 text-sm font-semibold text-white">Add Course</button>
      </div>
    </div>
  );
};

export default AddCDPTraining;
